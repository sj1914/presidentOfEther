//Democracy has broken down and as a result, the only way to gain power is to 
//convince the current president with bribery. 

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

pragma solidity ^0.4.19;

contract Country {
    using SafeMath for uint;
    string public countryName;
    
    // They run the country 
    struct President {
        string name;
        //Where to send the ether too
        address bank;
        // When their rule began
        uint inaugerationDate;
        //How much they bribed
        uint bribeAmountWei;
    }
    
    President[] public presidents;
    
    event ImpeachmentEvent(uint monarchNumber);
    event BribeOfferedEvent(address addr, uint WeiAmount);
    event BribeRefusedEvent(address addr, uint WeiAmount);
    
    function Country(
        string _countryName
    ) {
        countryName = _countryName;

        // Dummy entry
        presidents.push(
            President(
                "",
                0,
                0,
                0
            )
        );
    }
    
    function latestPresident() constant internal
    returns (President storage president) {
        return presidents[presidents.length - 1];
    }

    function currentPresident() public constant
    returns (string, uint) {
        return (presidents[presidents.length - 1].name,presidents[presidents.length - 1].inaugerationDate);
    }

    function numberOfPresidents() public constant
    returns (uint256 number) {
        return presidents.length;
    }

    function getPresident(uint index) public 
    returns(string, address, uint, uint) {
    return (presidents[index].name, presidents[index].bank, presidents[index].inaugerationDate, presidents[index].bribeAmountWei);
    }
    
    function bribeRequired() constant internal
    returns (uint amount) {
        uint lastBribeAmountWei = latestPresident().bribeAmountWei;
        uint newBribeAmountWei = lastBribeAmountWei + 10;
        return newBribeAmountWei;
    }

    function bribeAmount() public constant
    returns (uint256 amount) {
        return bribeRequired();
    }
        
    function bribeLatestPresident(uint _weiAmount) {
        address bankAddress =
        latestPresident().bank;
        // record that we compensated them
        latestPresident().bribeAmountWei = _weiAmount;
        
        bankAddress.call.value(_weiAmount).gas(23000);
    }
    
    function claimPresidency(string _presidentName) payable {
        claimPresidencyInternal(_presidentName);
    }
    
    function claimPresidencyInternal(
        string _presidentName
    ) internal {
        address _bank = msg.sender;
        uint paid = msg.value;
        uint price = bribeRequired();

        if (_bank == 0 || _bank == address(this)) {
            BribeRefusedEvent(_bank, msg.value);
            throw;
        }

        if (paid < price) {
            BribeRefusedEvent(_bank, msg.value);
            throw;
        }

        if (paid != 0) {
            BribeOfferedEvent(_bank, paid);
            bribeLatestPresident(paid);
        }

        presidents.push(President(
            _presidentName,
            _bank,
            now,
            price
        ));

        ImpeachmentEvent(presidents.length - 1);
    }
    
}