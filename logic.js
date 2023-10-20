function dollarToPercent()
{
    var totalAmount = document.loanForm.totalAmount.value;
    var downDollar = document.loanForm.downDollar.value;

    const ratio = downDollar / totalAmount

    var newPct = Math.round(ratio * 1000) / 10;

    document.loanForm.downPct.value = newPct;
}

function percentToDollar()
{
    var totalAmount = document.loanForm.totalAmount.value;
    var downPct = document.loanForm.downPct.value;

    const decPct = downPct / 100
    const downPayment = totalAmount * decPct

    document.loanForm.downDollar.value = downPayment;
}

function clearForm()
{
    document.loanForm.totalAmount.value = "0";
    document.loanForm.downDollar.value = "0";
    document.loanForm.downPct.value = "0";
    document.loanForm.termYear.value = "0";
    document.loanForm.termMonth.value = "0";
    document.loanForm.rate.value = "0";
    document.loanForm.extra.value = "0";

    document.getElementById("loan_info").innerHTML="";
    document.getElementById("loan_table").innerHTML="";

    console.log("Clear Form Activated")
}

function validate()
{
    var totalAmount = document.loanForm.totalAmount.value;
    var downDollar = document.loanForm.downDollar.value;
    var downPct = document.loanForm.downPct.value;
    var years = document.loanForm.termYear.value;
    var months = document.loanForm.termMonth.value;
    var rate = document.loanForm.rate.value;
    var extra = document.loanForm.extra.value;

    //Number() returns value or NaN, isNaN returns TRUE or FALSE
    //Combined we can check if the value is a number and return TRUE or FALSE
    if (totalAmount <= 0 || isNaN(Number(totalAmount)))
    {
        alert("Total Amount must be > 0.");
    }
    else if (downDollar < 0 || isNaN(Number(downDollar)))
    {
        alert("Down Payment $ must be non-negative.");
    }
    else if (downPct < 0 || isNaN(Number(downPct)))
    {
        alert("Down Payment % must be non-negative.");
    }

    // parseInt(years) casts years as integer
    // If int(years) != years THEN years is not an integer
    else if (years < 0 || parseInt(years) != years)
    {
        alert("Loan Term Years must be a whole number that is >= 0.");
    }
    else if (months < 0 || parseInt(months) != months)
    {
        alert("Loan Term Months must be a whole number that is >= 0.");
    }
    else if (months == 0 && years == 0)
    {
        alert("Loan term must be at least 1 month.")
    }
    else if (rate <= 0 || isNaN(Number(rate)))
    {
        alert("Rate % must be > 0.");
    }
    else if (extra < 0 || isNaN(Number(extra)))
    {
        alert("Extra Monthly Payments must be non-negative.");
    }
    else
    {
        // Converting all read-in text values into floats or integers
        calculate(parseFloat(totalAmount), parseFloat(downDollar), parseInt(years), parseInt(months), parseFloat(rate), parseFloat(extra));
    }
    

}

function calculate(totalAmount, downDollar, years, months, percRate, extra)
{

    const decRate = percRate / 100;

    const amount = totalAmount - downDollar

    const time = (years * 12) + months

    const monthlyPayment = (amount * (decRate / 12) * Math.pow((1 + (decRate / 12)), time) / (Math.pow((1 + (decRate / 12)), time) - 1)).toFixed(2);

    const totalPayment = (parseFloat(monthlyPayment) + extra).toFixed(2)

    populateLoanInfo(amount, monthlyPayment, totalPayment, extra)

    populateTable(amount, parseFloat(totalPayment).toFixed(2), decRate)

}

function populateLoanInfo(amount, monthlyPayment, totalPayment, extra)
{
    var info = "";

    info += "<table class = 'cinfoT' width = '230px'; height = '270px'; style = 'margin-left: 20px'>";

    info += "<tr><td>Balance:</td>";
    info += "<td style = 'padding-block: 5px;'>$" + amount + "</td></tr>"

    info += "<tr><td>Monthly Payment:</td>";
    info += "<td style = 'padding-block: 5px;'>$" + monthlyPayment + "</td></tr>"

    info += "<tr><td>Extra:</td>";
    info += "<td style = 'padding-block: 5px;'>$" + extra + "</td></tr>"

    info += "<tr><td>Total Payment:</td>";
    info += "<td style = 'padding-block: 5px;'>$" + totalPayment + "</td></tr>"

    info += "</table>"

    document.getElementById("loanInfo").innerHTML = info;
}

function populateTable(amount, monthlyPayment, decRate)
{
    var table = "";

    table += 
        "<table class = 'cinfoT' width = '600px'>" +
            "<tr align = 'center'>" +
                "<td>Month</td>" +
                "<td>Payment</td>" +
                "<td>Interest</td>" +
                "<td>Principal</td>" +
                "<td>Balance</td>" +
            "</tr>" +
            "<tr align = 'left'>" +
                "<td>0</td>" +
                "<td>0</td>" +
                "<td>0</td>" +
                "<td>0</td>" +
                "<td>" + amount + "</td>" +
            "</tr>"

    var currentBalance = amount;
    var paymentCounter = 1;

    while(currentBalance > 0)
    {
        var towardsInterest = Math.round(((decRate / 12) * currentBalance)*100)/100;
        var towardsBalance = Math.round((monthlyPayment - towardsInterest) * 100) / 100;

        currentBalance = Math.round((currentBalance - towardsBalance) * 100) / 100;

        if (currentBalance < 0)
        {

            monthlyPayment = parseFloat(monthlyPayment)
            currentBalance = parseFloat(currentBalance)

            monthlyPayment = monthlyPayment + currentBalance
            towardsBalance = monthlyPayment - towardsInterest
            currentBalance = 0

        }

        table += 
            "<tr align = 'left'>" +
                "<td>" + paymentCounter + "</td>" +
                "<td>" + monthlyPayment + "</td>" + 
                "<td>" + towardsInterest + "</td>" + 
                "<td>" + towardsBalance + "</td>" + 
                "<td>" + currentBalance + "</td>" + 
            "</tr>";

        paymentCounter++;
    }

    //console.log(table)
    document.getElementById('table').innerHTML = table;
}
