import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import country_artifacts from '../../build/contracts/Country.json'

var Country = contract(country_artifacts);

window.claimPresidency = function(president) {
  let presidentName = $("#presidentName").val();
  var amountPaid = $("#amountPaid").val();
  // var bankAddress = $("#bankAddress").val();
  try {
    $("#msg").html("If your claim was successful you will appear as the current president.")
    $("#presidentName").val("");
    $("#amountPaid").val("");

    Country.deployed().then(function(contractInstance) {
      contractInstance.claimPresidency(presidentName, {value: amountPaid, from: web3.eth.accounts[0], gas: 300000}).then(function() {
        $("#current-president").html(presidentName);
          // var tableRef = document.getElementById('past-presidents').getElementsByTagName('tbody')[0];
          // var newPresidentRow   = tableRef.insertRow(0);

          // var nameCell  = newPresidentRow.insertCell(0);
          // var amountCell  = newPresidentRow.insertCell(1);

          // var nameText  = document.createTextNode(presidentName);
          // var amountText  = document.createTextNode(amountPaid);

          // nameCell.appendChild(nameText);
          // amountCell.appendChild(amountText);
          // $("#msg").html("");
      })
      contractInstance.bribeAmount({from:web3.eth.accounts[0]}).then(bribe => {
      console.log(bribe)
      $("#bribe-required").html(bribe.toString());
    });
    });
  } catch (err) {
    $("#msg").html("Your bribe has been unsuccessful");
    console.log(err);
  }
}

$( document ).ready(function() {

  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source like Metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  Country.setProvider(web3.currentProvider);

  Country.deployed().then(function(contractInstance) {
    contractInstance.countryName().then(function(name) {
      $("#country-name").html(name.toString());
    });
  });

  Country.deployed().then(function(contractInstance) {
    contractInstance.bribeAmount({from:web3.eth.accounts[0]}).then(bribe => {
      console.log(bribe)
      $("#bribe-required").html(bribe.toString());
    });
  });

  Country.deployed().then(function(contractInstance) {
    contractInstance.currentPresident.call({from:web3.eth.accounts[0]}).then(function(nameDate) {
      $("#current-president").html(nameDate[0].toString());
    });
  });

  let numOfPresidents = 0;
  Country.deployed().then(function(contractInstance) {
    contractInstance.numberOfPresidents({from:web3.eth.accounts[0]}).then(number => {
      numOfPresidents = number.toString();
    });
  });
  console.log(numOfPresidents)

  for (var i = 0; i < numOfPresidents; i++) {
    Country.deployed().then(function(contractInstance) {
    contractInstance.getPresident(i, {from:web3.eth.accounts[0]}).then(function(president) {
      console.log(president);
    });
  });
  }
});

