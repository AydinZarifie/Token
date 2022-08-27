// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Token {


    string public name;
    string public symple;
    uint public decimal;
    uint256 public totalSupply;
    address public minter;
    uint256 public tokenPrice;
    
    mapping (address => uint256) public balances;


    constructor(uint _totalSupply){

        totalSupply = _totalSupply;
        name = "Test token";
        symple = "TST";
        decimal = 8;
        minter = msg.sender;
        tokenPrice = 10**15 wei; //0.001 eth

    }

    function transfer (address _to , uint amount) public {

        require(balances[msg.sender] >= amount , "Not enough value");
        
       balances[msg.sender] -= amount ;
       balances[_to] += amount ;
    
    }


    function mint (address _to , uint amount) public {

        require(msg.sender == minter , "Only minter can mint");

        balances[_to] += amount;
        totalSupply += amount;
    }

    function buy(uint amount) public payable{

        require(amount <= totalSupply , "Not enough value");
        require(msg.value == amount * tokenPrice , "Your value is not enough");

        balances[msg.sender] += amount;
        balances[minter] -= amount;

    }


}
