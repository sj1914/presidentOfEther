import "../stylesheets/app.css";

import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

import country_artifacts from '../../build/contracts/Country.json'

var Country = contract(country_artifacts);

// let candidates = {"Rama": "candidate-1", "Nick": "candidate-2", "Jose": "candidate-3"}

// window.voteForCandidate = function(candidate) {
//   let candidateName = $("#candidate").val();
//   try {
//     $("#msg").html("Vote has been submitted. The vote count will increment as soon as the vote is recorded on the blockchain. Please wait.")
//     $("#candidate").val("");

//      Voting.deployed() returns an instance of the contract. Every call
//      * in Truffle returns a promise which is why we have used then()
//      * everywhere we have a transaction call
     
//     Voting.deployed().then(function(contractInstance) {
//       contractInstance.voteForCandidate(candidateName, {gas: 140000, from: web3.eth.accounts[0]}).then(function() {
//         let div_id = candidates[candidateName];
//         return contractInstance.totalVotesFor.call(candidateName).then(function(v) {
//           $("#" + div_id).html(v.toString());
//           $("#msg").html("");
//         });
//       });
//     });
//   } catch (err) {
//     console.log(err);
//   }
// }

window.claimPresidency = function(president) {
  let presidentName = $("#presidentName").val();
  var amountPaid = $("#amountPaid").val();
  var amountPaid = '10';
  try {
    $("#msg").html("Your offer has been submitted. Please wait to find out if you have been accepted as the new President.")
    $("#presidentName").val("");
    $("#amountPaid").val("");

    Country.deployed().then(function(contractInstance) {
      contractInstance.claimPresidency(presidentName, {value: amountPaid, from: web3.eth.accounts[0], gas: 300000}).then(function() {
          var tableRef = document.getElementById('past-presidents').getElementsByTagName('tbody')[0];
          var newPresidentRow   = tableRef.insertRow(0);

          var nameCell  = newPresidentRow.insertCell(0);
          var amountCell  = newPresidentRow.insertCell(1);

          var nameText  = document.createTextNode(presidentName);
          var amountText  = document.createTextNode(amountPaid);

          nameCell.appendChild(nameText);
          amountCell.appendChild(amountText);
          $("#msg").html("");
      })
    });
  } catch (err) {
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
      $("#country-name").html(name);
    });
  });
  
  // for (var i = 0; i < 3; i++) {
  // Country.deployed().then(function(contractInstance) {
  //   contractInstance.getPresident.call(i).then(function(v) {
  //     console.log(v)
  //   });
  // });
  // };
  // let candidateNames = Object.keys(candidates);
  // for (var i = 0; i < candidateNames.length; i++) {
  //   let name = candidateNames[i];
  //   Voting.deployed().then(function(contractInstance) {
  //     contractInstance.totalVotesFor.call(name).then(function(v) {
  //       $("#" + candidates[name]).html(v.toString());
  //     });
  //   })
  // }
});

