[//]: # (title: 類別)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types.md">基本型別</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections.md">集合</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow.md">控制流程</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions.md">函數</a><br />
        <img src="icon-6.svg" width="20" alt="Sixth step" /> <strong>類別</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety.md">Null 安全</a></p>
</tldr>

Kotlin 支援物件導向程式設計，其中包含類別與物件。物件對於在程式中儲存資料非常有用。
類別允許您宣告物件的一組特性。當您從類別建立物件時，可以節省時間與精力，因為您不必每次都宣告這些特性。

若要宣告類別，請使用 `class` 關鍵字：

```kotlin
class Customer
```

## 屬性

類別物件的特性可以在屬性中宣告。您可以為類別宣告屬性：

* 在類別名稱後的括號 `()` 內。
```kotlin
class Contact(val id: Int, var email: String)
```

* 在由大括號 `{}` 定義的類別主體內。
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

我們建議您將屬性宣告為唯讀 (`val`)，除非在建立類別實例後需要變更它們。

您可以在括號內宣告不帶 `val` 或 `var` 的屬性，但這些屬性在建立實例後將無法存取。

> * 括號 `()` 中包含的內容稱為**類別標頭 (class header)**。
> * 在宣告類別屬性時，您可以使用 [尾隨逗號 (trailing comma)](coding-conventions.md#trailing-commas)。
>
{style="note"}

如同函數參數一樣，類別屬性可以有預設值：
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## 建立實例

若要從類別建立物件，您可以使用**建構函式 (constructor)** 宣告一個類別**實例 (instance)**。

預設情況下，Kotlin 會自動建立一個帶有類別標頭中宣告的參數的建構函式。

例如：
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-class-create-instance"}

在此範例中：

* `Contact` 是一個類別。
* `contact` 是 `Contact` 類別的實例。
* `id` 和 `email` 是屬性。
* `id` 和 `email` 與預設建構函式一起用於建立 `contact`。

Kotlin 類別可以有多個建構函式，包括您自行定義的。若要了解如何宣告多個建構函式，請參閱 [建構函式 (Constructors)](classes.md#constructors)。

## 存取屬性

若要存取實例的屬性，請在實例名稱後加上句點 `.`，然後寫上屬性名稱：

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // 印出屬性 email 的值
    println(contact.email)           
    // mary@gmail.com

    // 更新屬性 email 的值
    contact.email = "jane@gmail.com"
    
    // 印出屬性 email 的新值
    println(contact.email)           
    // jane@gmail.com
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-access-property"}

> 若要將屬性值串接到字串中，可以使用字串範本 (`$`)。
> 例如：
> ```kotlin
> println("Their email address is: ${contact.email}")
> ```
>
{style="tip"}

## 成員函數

除了將屬性宣告為物件特性的一部分之外，您還可以使用成員函數定義物件的行為。

在 Kotlin 中，成員函數必須在類別主體內宣告。若要在實例上呼叫成員函數，請在實例名稱後加上句點 `.`，然後寫上函數名稱。例如：

```kotlin
class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    // 呼叫成員函數 printId()
    contact.printId()           
    // 1
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-member-function"}

## 資料類別

Kotlin 具有**資料類別 (data classes)**，它們對於儲存資料特別有用。資料類別具有與一般類別相同的功能，但它們會自動提供額外的成員函數。這些成員函數讓您可以輕鬆地將實例印出為可讀的輸出、比較類別的實例、複製實例等等。由於這些函數是自動可用的，因此您無需花時間為每個類別編寫相同的樣板程式碼。

若要宣告資料類別，請使用 `data` 關鍵字：

```kotlin
data class User(val name: String, val id: Int)
```

資料類別最有用的一些預定義成員函數包括：

| **函數**           | **描述**                                                                                             |
|--------------------|------------------------------------------------------------------------------------------------------|
| `toString()`       | 將類別實例及其屬性印出為可讀的字串。                                                                 |
| `equals()` 或 `==` | 比較類別的實例。                                                                                     |
| `copy()`           | 透過複製另一個類別實例來建立一個新實例，可選擇性地變更部分屬性。                                     |

請參閱以下章節，以了解如何使用每個函數的範例：

* [印為字串](#print-as-string)
* [比較實例](#compare-instances)
* [複製實例](#copy-instance)

### 印為字串

若要將類別實例印為可讀的字串，您可以明確呼叫 `toString()` 函數，或使用印出函數 (`println()` 和 `print()`)，它們會自動為您呼叫 `toString()`：

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    
    // 自動使用 toString() 函數，使輸出易於閱讀
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-print-string"}

這在偵錯或建立日誌時特別有用。

### 比較實例

若要比較資料類別實例，請使用等於運算子 `==`：

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // 比較 user 與 secondUser
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // 比較 user 與 thirdUser
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-compare-instances"}

### 複製實例

若要建立資料類別實例的精確副本，請在該實例上呼叫 `copy()` 函數。

若要建立資料類別實例的副本**並**變更部分屬性，請在該實例上呼叫 `copy()` 函數**並**將替換值作為函數參數新增到屬性中。

例如：

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)

    // 建立 user 的精確副本
    println(user.copy())       
    // User(name=Alex, id=1)

    // 建立 user 的副本，並將 name 設為 "Max"
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // 建立 user 的副本，並將 id 設為 3
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-copy-instance"}

建立實例的副本比修改原始實例更安全，因為依賴原始實例的任何程式碼都不會受到副本及其操作的影響。

有關資料類別的更多資訊，請參閱 [資料類別 (Data classes)](data-classes.md)。

本教學的最後一章是關於 Kotlin 的 [Null 安全 (Null safety)](kotlin-tour-null-safety.md)。

## 練習

### 練習 1 {initial-collapse-state="collapsed" collapsible="true"}

定義一個資料類別 `Employee`，其中包含兩個屬性：一個用於姓名，另一個用於薪水。請確保薪水屬性是可變的，否則您將在年底無法獲得加薪！`main` 函數展示了如何使用此資料類別。

|---|---|
```kotlin
// Write your code here

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-1"}

|---|---|
```kotlin
data class Employee(val name: String, var salary: Int)

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-classes-solution-1"}

### 練習 2 {initial-collapse-state="collapsed" collapsible="true"}

宣告此程式碼編譯所需的額外資料類別。

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
// Write your code here
// data class Name(...)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-2"}

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
data class Name(val first: String, val last: String)
data class Address(val street: String, val city: City)
data class City(val name: String, val countryCode: String)

fun main() {
    val person = Person(
        Name("John", "Smith"),
        Address("123 Fake Street", City("Springfield", "US")),
        ownsAPet = false
    )
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-classes-solution-2"}

### 練習 3 {initial-collapse-state="collapsed" collapsible="true"}

若要測試您的程式碼，您需要一個可以建立隨機員工的產生器。定義一個 `RandomEmployeeGenerator` 類別，其中包含固定的潛在姓名列表（在類別主體內）。配置類別的最低和最高薪水（在類別標頭內）。在類別主體中，定義 `generateEmployee()` 函數。`main` 函數再次展示了如何使用此類別。

> 在此練習中，您需要匯入一個套件，以便可以使用 [`Random.nextInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/next-int.html) 函數。
> 有關匯入套件的更多資訊，請參閱 [套件與匯入 (Packages and imports)](packages.md)。
>
{style="tip"}

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-1">
    <def title="提示 1">
        列表有一個擴充函數，稱為 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html"><code>.random()</code></a>，它會返回列表中的一個隨機項目。
    </def>
</deflist>

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-2">
    <def title="提示 2">
        <code>Random.nextInt(from = ..., until = ...)</code> 會為您提供指定範圍內的一個隨機 <code>Int</code> 數字。
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

// Write your code here

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-3"}

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

class RandomEmployeeGenerator(var minSalary: Int, var maxSalary: Int) {
    val names = listOf("John", "Mary", "Ann", "Paul", "Jack", "Elizabeth")
    fun generateEmployee() =
        Employee(names.random(),
            Random.nextInt(from = minSalary, until = maxSalary))
}

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="範例解答" id="kotlin-tour-classes-solution-3"}

## 下一步

[Null 安全 (Null safety)](kotlin-tour-null-safety.md)