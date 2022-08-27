url = "http://127.0.0.1:7545";
currentAccount = null;
minterAddress = null;
tokenPrice = null;
web3Provider = null;
contract = {};


$(function(){
    $(window).load(function(){
        init();
    })
})


function init(){

    console.log("Your Dapp is runing");

    return initWeb3();
}


async function initWeb3(){

    const provider = await detectEthereumProvider();

    if(!provider){
        alert("Please install or login to metamask");
        return false;
    }

    if(typeof web3 == 'undefined'){
        web3Provider = provider;
    }

    else{
        web3Provider = new Web3.providers.HttpProvider(url);
    }

    web3 = new Web3(web3Provider);


    ethereum.on('accountsChanged' , handleAccountChanged);

    handleAccountChanged();
    populateAccounts();

    return initContract();
}


function handleAccountChanged(){

    ethereum.request({method:'eth_requestAccounts'}).then(function (accounts){

        web3.eth.defaultAccount = accounts[0];
        currentAccount = web3.eth.defaultAccount;

        $("#current-address").text("current User Account : " +  currentAccount);
    })
}


//set network accounts to option tags

function populateAccounts(){
    
    web3 = new Web3(new Web3.providers.HttpProvider(url));

    web3.eth.getAccounts(function(err , accounts){

        jQuery.each(accounts , function(idx){

            var optionTag = `<option value = ${accounts[idx]}> ${accounts[idx]} </option>`;

            $("#option-balance").append(optionTag);
            $("#option-mint").append(optionTag);
            if(currentAccount != accounts[idx])
            $("#option-transfer").append(optionTag);

        })
    })
}


function initContract(){

    $.getJSON('Token.json' , function(artifact){

        contract.token = TruffleContract(artifact);
        contract.token.setProvider(web3Provider);
    }).then(function(){

        getMinter();
        getTokenPrice();
        getTotalSupply();
    })

    return bindEvent();
}

function  getMinter(){

    contract.token.deployed().then(function(instance){

        return instance.minter();

    }).then(function(result){

        minter = result;
        $("#minter-address").text("Minter: " + minter);
    })
}

function getTokenPrice(){

    contract.token.deployed().then(function(instance){

        return instance.tokenPrice();
    }).then(function(result){

        tokenPrice = result.toNumber();
        result /= Math.pow(10,18);
      

        $("#token-price").text("Token Price: " + result + " Eth");
    })
}


function getTotalSupply(){

    contract.token.deployed().then(function(instance){

        return instance.totalSupply();
    }).then(function(result){

        totalSupply = result;
        
        $("#totalSupply").text("Total Supply: " + result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " TST Token");

    })
}


function bindEvent(){

    $(document).on('click','#Balance',showBalance);
    $(document).on('click','#transfer',transfer);
    $(document).on('click','#mint',mint);
    $(document).on('click','#buy',buy);

}


function showBalance(){

    contract.token.deployed().then(function(instance){

        var address = $("#option-balance").val();


 
        return instance.balances(address);

    }).then(function(result){

        $("#balanceToken").val(result);
    
    })

}

function transfer(){

    contract.token.deployed().then(function(instance){

        var address = $("#option-transfer").val();
        var amount = $("#amountTransfer").val();
        return instance.transfer(address,amount);

    }).then(function(result){

        if(result.receipt.status == "0x1"){
            alert("Successs");
        }

        if(result.receipt.status == "0x0"){
            alert("Transaction was failed");
        }
    })

}

function mint(){

    contract.token.deployed().then(function(instance){

        var address = $("#option-mint").val();
        var amount = $("#amountMint").val();


        return instance.mint(address , amount);
        
    }).then(function(){

        getTotalSupply()
    })
}

function buy(){

    contract.token.deployed().then(function(instance){

        var amount = $("#amountBuy").val();
        
        var txObj = {

            from: currentAccount ,
            to: minter,
            value : tokenPrice * amount 
        }

        return instance.buy(amount , txObj);
    
    })
}