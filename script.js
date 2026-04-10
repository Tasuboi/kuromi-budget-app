let selectedIcon = ""
let income = 0
let categories = []
let history = []
let goals = []
let chart

function selectIcon(el){

// remove previous selection
document.querySelectorAll(".icon-item").forEach(item=>{
item.classList.remove("selected")
})

// highlight selected
el.classList.add("selected")

// get image inside clicked item
let img = el.querySelector("img")

selectedIcon = img.src
}

function save(){
localStorage.setItem("kuromiFinance", JSON.stringify({
income, categories, history, goals
}))
}

function load(){
let data = JSON.parse(localStorage.getItem("kuromiFinance"))

if(data){
income = data.income || 0
categories = data.categories || []
history = data.history || []
goals = data.goals || []
}

render()
}

function setIncome(){
let val = Number(document.getElementById("incomeInput").value)
if(!val || val <= 0) return

income = val
save()
render()
}

function addCategory(){
let name = document.getElementById("categoryName").value
let amount = Number(document.getElementById("categoryAmount").value)
let icon = selectedIcon || "icons/default.png"

if(!name || amount <= 0) return

categories.push({name, amount, icon, spent:0})

save()
render()
}

function deleteCategory(i){
if(confirm("Delete this category?")){
categories.splice(i,1)
save()
render()
}
}

function addExpense(i){
let amount = Number(prompt("Amount spent"))
if(!amount || amount <= 0) return

categories[i].spent += amount

history.push({
type:"expense",
name:categories[i].name,
amount:amount
})

save()
render()
}

function addGoal(){
let name = document.getElementById("goalName").value
let amount = Number(document.getElementById("goalAmount").value)

if(!name || amount <= 0) return

goals.push({name, amount, saved:0})

save()
render()
}

function addSavings(i){
let amount = Number(prompt("Add savings"))
if(!amount || amount <= 0) return

goals[i].saved += amount

history.push({
type:"saving",
name:goals[i].name,
amount:amount
})

save()
render()
}

function deleteHistory(i){
history.splice(i,1)
save()
render()
}

function resetMonth(){
if(confirm("Reset all expenses for new month?")){
categories.forEach(c => c.spent = 0)
history.push("🔄 Month reset")
save()
render()
}
}

function clearAll(){
if(confirm("This will delete EVERYTHING")){
localStorage.removeItem("kuromiFinance")

income = 0
categories = []
history = []
goals = []

render()
}
}

function render(){
document.getElementById("incomeDisplay").innerText = "৳" + income

let spent = 0
categories.forEach(c => spent += c.spent)

document.getElementById("spentDisplay").innerText = "৳" + spent
document.getElementById("remainingDisplay").innerText = "৳" + (income - spent)

renderCategories()
renderGoals()
renderHistory()
renderChart()
}

function renderCategories(){
let div = document.getElementById("categories")
div.innerHTML = ""

categories.forEach((c,i)=>{

let percent = (c.spent / c.amount) * 100
if(percent > 100) percent = 100

div.innerHTML += `
<div class="category">
<h3><img src="${c.icon}" class="icon"> ${c.name}</h3>
<p>৳${c.spent} / ৳${c.amount}</p>

<div class="progressBar">
<div class="progress" style="width:${percent}%"></div>
</div>

<button onclick="addExpense(${i})">Add Expense</button>
<button onclick="deleteCategory(${i})">❌ Delete</button>
</div>
`
})
}

function renderGoals(){
let div = document.getElementById("goals")
div.innerHTML = ""

goals.forEach((g,i)=>{

let percent = (g.saved / g.amount) * 100
if(percent > 100) percent = 100

div.innerHTML += `
<div class="goal">
<h3>🎀 ${g.name}</h3>
<p>৳${g.saved} / ৳${g.amount}</p>

<div class="progressBar">
<div class="progress" style="width:${percent}%"></div>
</div>

<button onclick="addSavings(${i})">💰 Add Savings</button>
<button onclick="removeSavings(${i})">➖ Remove</button>
<button onclick="deleteGoal(${i})">❌ Delete</button>
</div>
`
})
}

function removeSavings(i){

let amount = Number(prompt("Remove savings"))

if(!amount || amount <= 0) return

goals[i].saved -= amount

// prevent negative
if(goals[i].saved < 0) goals[i].saved = 0

history.push({
type:"remove_saving",
name:goals[i].name,
amount:amount
})

save()
render()

}

function deleteGoal(i){

if(confirm("Delete this goal?")){

goals.splice(i,1)

save()
render()

}

}

function renderHistory(){
let list = document.getElementById("historyList")
list.innerHTML = ""

history.slice().reverse().forEach((h,index)=>{

let text = typeof h === "string" ? h :
`${h.name} - ৳${h.amount}`

list.innerHTML += `
<li>
${text}
<button onclick="deleteHistory(${history.length-1-index})">❌</button>
</li>
`
})
}

function renderChart(){
let ctx = document.getElementById("chart")

let labels = categories.map(c=>c.name)
let data = categories.map(c=>c.spent)

if(chart) chart.destroy()

chart = new Chart(ctx,{
type:'doughnut',
data:{
labels:labels,
datasets:[{
data:data,
backgroundColor:[
'#c084fc','#ff9ff3','#9333ea','#a855f7','#d946ef'
]
}]
}
})
}

function showPage(id){
document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"))
document.getElementById(id).classList.add("active")
}

load()
showPage("dashboard")