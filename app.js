var budgetController = (function() {
    var Expense = function(id,des,value){
        this.id = id;
        this.description = des;
        this.value = value;
    }

    var Income = function(id,description,value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        })
        data.totals[type] = sum;
    }

    var data = {
        allItems : {
            inc : [],
            exp : []
        },
        totals : {
            inc : 0,
            exp : 0
        },
        budget : 0,
        percentage : -1
    }

    return{
        addItem : function(type,description,value){
            var newItem,ID;

            if(data.allItems[type].length > 0){
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else{
                ID = 0;
            }

            if(type === 'inc'){
                newItem = new Income(ID,description,value);
            }
            else{
                newItem = new Expense(ID,description,value);
            }
            data.allItems[type].push(newItem);

            return newItem;
        },
        calculateBudget : function(){
            calculateTotal('inc');
            calculateTotal('exp');

            data.budget = data.totals.inc - data.totals.exp;

            if(data.budget > 0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            }
            else{
                data.percentage = -1;
            }
        },
        getBudget : function(){
            return {
                budget : data.budget,
                income : data.totals.inc,
                expense : data.totals.exp,
                percentage : data.percentage
            }
        },
        deleteListItem : function(type,id){
            var ids, index;
            
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });

            index = ids.indexOf(parseInt(id));

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

            
            
        }

    }

})();


var UIController = (function(){
    DOMstring = {
        inputType : '.add-type',
        inputdes : '.add-description',
        inputValue : '.add-value',
        inputSub : '.add-sub',
        budgetLabel : '.net-sum',
        incomeLabel : '.net-income',
        expenseLabel : '.net-expenditure',
        percentageLabel : '.net-expenditure-percen',
        incomeContainer : '.inco',
        expenseContainer : '.expe',
        container : '.bottom',
        yearMonth : 'month-id'
        
    }
    return{
        elements : function(){
            return DOMstring;
        },
        getInput : function(){
            return{
                type : document.querySelector(DOMstring.inputType).value,
                description : document.querySelector(DOMstring.inputdes).value,
                value : parseFloat(document.querySelector(DOMstring.inputValue).value)
            }
        },
        clearField : function(){
            var field,fieldArr;
            field = document.querySelectorAll(DOMstring.inputdes + ', ' + DOMstring.inputValue);
            fieldArr = Array.prototype.slice.call(field);
            fieldArr.forEach(function(current,index,array){
                current.value = "";
            })
            fieldArr[0].focus();
        },
        displayBudget : function(obj){
            var numSplit1,num1;
            var a = parseFloat(obj.income);
            a = a.toFixed(2);
            a = a.toString();
            var c = a.split('.');
            var b = c[0]; 
            if(b.length > 5){
                b = b.substr(0,b.length - 5) + ',' + b.substr(b.length - 5 , 2) + ',' + b.substr(b.length-3,b.length);
            }
            else if(b.length > 3){
                b = b.substr(0,b.length - 3) + ',' + b.substr(b.length - 3 , b.length);
            }
            b = '+' + b + '.' + c[1];
            var d = parseFloat(obj.expense);
            d = d.toFixed(2);
            d = d.toString();
            c = d.split('.');
            var e = c[0];
            if(e.length > 5){
                e = e.substr(0,e.length - 5) + ',' + e.substr(e.length - 5 , 2) + ',' + e.substr(e.length-3,e.length);
            }
            else if(e.length > 3){
                e = e.substr(0,e.length - 3) + ',' + e.substr(e.length - 3 , e.length);
            }
            if(e === "0" && c[1] === "00"){
                e = e + '.' + c[1];
            }
            else{
                e = '-' + e + '.' + c[1];
            }
            var g = parseFloat(obj.budget);
            g = g.toFixed(2);
            g = g.toString();
            c = g.split('.');
            var h = c[0].split('-');
            var j;
            if(h[1] === undefined){
                j = 0;
            }
            else{
                j = 1;
            }
            var f = h[j];
            if(f.length > 5){
                f = f.substr(0,f.length - 5) + ',' + f.substr(f.length - 5 , 2) + ',' + f.substr(f.length-3,f.length);
            }
            else if(f.length > 3){
                f = f.substr(0,f.length - 3) + ',' + f.substr(f.length - 3 , f.length);
            }
            if(f === "0" && c[1] === "00"){
                f = f + '.' + c[1];
            }
            if(j === 0){
                f = '+' + f + '.' + c[1];
            }
            else{
                f = '-' + f + '.' + c[1];
            }

            document.querySelector(DOMstring.budgetLabel).textContent = f;
            document.querySelector(DOMstring.incomeLabel).textContent = b;
            document.querySelector(DOMstring.expenseLabel).textContent = e;
            if(obj.budget > 0){
                document.querySelector(DOMstring.percentageLabel).textContent = parseFloat(obj.percentage) + "%";
            }
            else{
                document.querySelector(DOMstring.percentageLabel).textContent = "--"
            }
        },
        addItemList : function(obj,type){
            var html,newHtml;
            var ele;

            if(type === "inc"){
                html = '<div class="income-source" id="inc-%id%"> <div class="description-0" id="des-%id%">%description%</div><div class="value-0" id="value-%id%">%value%</div><div class="delete-0" id="delete-%id%"><i class="fa fa-times-circle-o"></i></div></div>';
            }
            else if(type === "exp"){
                html = '<div class="expense-source" id="exp-%id%"><div class="description-1" id="des-%id%">%description%</div><div class="value-1" id="value-%id%">%value%</div><div class="delete-1" id="delete-%id%"><i class="fa fa-times-circle-o"></i></div></div>';
            }
            var b;
            if(type === "inc"){
                var a = parseFloat(obj.value);
                a = a.toFixed(2);
                a = a.toString();
                var c = a.split('.');
                b = c[0]; 
                if(b.length > 5){
                    b = b.substr(0,b.length - 5) + ',' + b.substr(b.length - 5 , 2) + ',' + b.substr(b.length-3,b.length);
                }
                else if(b.length > 3){
                    b = b.substr(0,b.length - 3) + ',' + b.substr(b.length - 3 , b.length);
                }
                b = '+' + b + '.' + c[1];
            }
            else if(type === "exp"){
                var a = parseFloat(obj.value);
                a = a.toFixed(2);
                a = a.toString();
                var c = a.split('.');
                var b = c[0]; 
                if(b.length > 5){
                    b = b.substr(0,b.length - 5) + ',' + b.substr(b.length - 5 , 2) + ',' + b.substr(b.length-3,b.length);
                }
                else if(b.length > 3){
                    b = b.substr(0,b.length - 3) + ',' + b.substr(b.length - 3 , b.length);
                }
                b = '-' + b + '.' + c[1];
            }
            newHtml = html.replace('%description%',obj.description);
            newHtml = newHtml.replace('%value%',b);
            newHtml = newHtml.replace('%id%',parseInt(obj.id));
            
            if(type === "inc"){
                ele = DOMstring.incomeContainer;
            }
            else{
                ele = DOMstring.expenseContainer;
            }
            document.querySelector(ele).insertAdjacentHTML('beforeend', newHtml);   
        },
        deleteUIListItem : function(seletedID){
            var ele = document.getElementById(seletedID);
            ele.parentNode.removeChild(ele);
        },
        displayMonth : function(){
            var year = document.getElementById(DOMstring.yearMonth).textContent;
            console.log(typeof(year));
            var a = new Date();
            var c = a.getFullYear();
            var b = a.getMonth();
            var months = ['January' , 'February' , 'March' , 'April' , 'May' , 'June' , 'July' , 'August' , 'September' , 'October' , 'November' , 'December'];
            year = year.replace('%month%',months[b] + ' ' + c);
            document.getElementById(DOMstring.yearMonth).textContent = year;
        }
    }
})();

var controller = (function(budCtrl,UICtrl){
    setupEventListner = function(){
        var DOM = UICtrl.elements();
        document.querySelector(DOM.inputSub).addEventListener('click',ctrlAddItem);

        document.addEventListener('keypress' , function(event){
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();
            }
        });

        document.querySelector(DOM.container).addEventListener('click',ctrlDeleteItem);
        UICtrl.displayMonth();
    }

    updateBudget = function(){
        budCtrl.calculateBudget();
        var budget = budCtrl.getBudget();
        UICtrl.displayBudget(budget);

    }

    ctrlAddItem = function(){
        var getInput = UICtrl.getInput();
        if(getInput.description !== "" && !isNaN(getInput.value) && getInput.value > 0){
            var newItem = budCtrl.addItem(getInput.type,getInput.description,getInput.value);
            UICtrl.addItemList(newItem,getInput.type);
            UICtrl.clearField();
            updateBudget();
        }
        else{
            alert("Please enter valid inputs");
        }
    }

    ctrlDeleteItem = function(event){
        var splitID,itemID,type,ID;

        itemID = event.target.parentNode.parentNode.id;
        if(itemID){
            splitID = itemID.split('-');
            type = splitID[0];
            ID = splitID[1];

            budCtrl.deleteListItem(type,ID);
            UICtrl.deleteUIListItem(itemID);
            updateBudget();
        }
        
    }

    return {
        init : function(){
            var a = new Date();
            // console.log(a.getFullYear());
            // console.log(a.getMonth());
            console.log("application is started");
            setupEventListner();
        }
    }

})(budgetController,UIController);

controller.init();