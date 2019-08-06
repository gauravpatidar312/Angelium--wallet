#include <eosio/eosio.hpp>
#include <eosio/print.hpp>
#include <eosio/asset.hpp>
#include <eosio/symbol.hpp>
#include <oraclize/eos_api.hpp>
#include <sstream>

using namespace eosio;

std::string vector_to_string2(std::vector<uint8_t> result) {
    char temp_char;
    std::string temp_num;
    for(auto i = result.begin(); i < result.end()-1; i++) {
        uint8_t temp = *i;
        if(temp == 10) {
          temp_num += ',';
          continue;
        }
        temp_char = temp;
        temp_num += temp_char;
    }
    return temp_num;
}

std::vector<uint8_t> split(std::string result_str) {
    std::vector<uint8_t> result_vector;
    std::string temp_num;
    for(int i = 0; result_str[i] != '\0'; i++) {
        if(result_str[i] == ',') {
            result_vector.push_back(std::atoi(temp_num.c_str()));
            temp_num = "";
            continue;
        }
        temp_num += result_str[i];
    }
    result_vector.push_back(std::atoi(temp_num.c_str()));
    return result_vector;
}

class [[eosio::contract]] lottery : public eosio::contract {
public:
    using contract::contract;

    //Calling Random.org Endpoint ( Off chain ) to decide Random Number and Bringing it back to the Smart contract with Proof.
    [[eosio::action]]
    void getwinner(std::string maxbets) {
        require_auth(_self);
        checksum256 queryId = oraclize_query("URL", "https://www.random.org/integers/?num=3&min=1&max="+maxbets+"&col=1&base=10&format=plain&rnd=new");
    }

    //Callback Function Called by Oraclicon Smart Contract in order to send us requested Data
    [[eosio::action]]
    void callback(checksum256 queryId, std::vector<uint8_t> result, std::vector<uint8_t> proof) {
        require_auth(provable_cbAddress());
        const std::string result_str = vector_to_string2(result);
        afterquery(result_str);
    }

    //Placing Bet i.e, storing records inside EOS Multi-index Table.
    //Escrow Bet Amount into our company account ( which is Smart Contract itself for lottery)
    [[eosio::action]]
    void placebet(name user, uint64_t number, asset betAmount, std::string ccomment, std::string wincomment) {
        require_auth(user);

        auto sym = betAmount.symbol;
        std::string mainsym = "XP";

        check( sym.is_valid(), "invalid symbol name" );
        check( sym.code()==symbol_code(mainsym.c_str()), "Betting is only Supported for XP Tokens" );

        recordindex records(_self, _self.value);
        auto iterator = records.find(number);

        check(iterator == records.end(),"Bet Already Placed");

        if( iterator == records.end() ){
            records.emplace(user, [&]( auto& row ) {
                row.user = user;
                row.betAmount = betAmount;
                row.lotteryid = number;
                row.ccomment = ccomment;
                row.wincomment = wincomment;
            });
        }
        action(
            permission_level{user,"active"_n},
            "angliumtoken"_n,
            "transfer"_n,
            std::make_tuple(user, _self, betAmount, std::string("Placing Bet XP Tokens"))
        ).send();
    }

    //Action Executed After Getting Winner To Insert Winner in the Specific Table ( which will be retreived afterwards )
    void afterquery(std::string result_str) {
        recordindex records(_self, _self.value);
        std::vector<uint8_t> result_vector = split(result_str);

        for(auto i = result_vector.begin(); i < result_vector.end(); i++) {
            uint8_t winner = *i;
            auto iterator = records.find(winner);
            lotwinindex tests(_self, _self.value);
            tests.emplace(_self, [&]( auto& row ) {
                row.number = winner;
                row.user = iterator->user;
            });
        }
    }

    //Removing the 1st winner from  " Winners Table " FOR 2nd and 3rd Winners.
    [[eosio::action]]
    void rem(uint64_t number) {
        require_auth(_self);

        recordindex records(_self, _self.value);
        auto iterator = records.find(number);

        records.erase(iterator);
    }

    //Reset The Records table and Free the RAM for Next Rounds
    [[eosio::action]]
    void reset(){
        require_auth(_self);

        recordindex records(_self, _self.value);
        for (auto i = records.begin(); i != records.end();) {
            i = records.erase(i);
        }

        lotwinindex lots(_self,_self.value);
        for (auto i = lots.begin(); i != lots.end();) {
            i = lots.erase(i);
        }
    }

    struct [[eosio::table]] record {
      uint64_t      lotteryid;
      name          user;
      asset         betAmount;
      std::string   ccomment;
      std::string   wincomment;

      uint64_t primary_key() const { return lotteryid; }
    };

    struct [[eosio::table]] lotwin {
      uint64_t number;
      name     user;

      uint64_t primary_key() const { return number; }
    };

    typedef eosio::multi_index<"lotwin"_n,lotwin>  lotwinindex;
    typedef eosio::multi_index<"record"_n, record> recordindex;
};

EOSIO_DISPATCH(lottery, (getwinner)(callback)(placebet)(rem)(reset))
