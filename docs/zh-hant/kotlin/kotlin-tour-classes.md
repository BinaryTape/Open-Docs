---
title: "類別 (Classes)"
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">基本型別 (Basic types)</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">集合 (Collections)</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">控制流程 (Control flow)</a><br />
        <img src="/img/icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">函式 (Functions)</a><br />
        <img src="/img/icon-6.svg" width="20" alt="Sixth step" /> <strong>類別 (Classes)</strong><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null 安全性 (Null safety)</a>
</p>

:::

Kotlin 支援使用類別 (classes) 和物件 (objects) 的物件導向程式設計 (object-oriented programming)。物件 (objects) 對於在您的程式中儲存資料很有用。
類別 (classes) 讓您可以宣告物件 (object) 的一組特性。當您從類別 (class) 建立物件 (objects) 時，您可以節省
時間和精力，因為您不必每次都宣告這些特性。

若要宣告類別 (class)，請使用 `class` 關鍵字：

```kotlin
class Customer
```

## 屬性 (Properties)

類別 (class) 物件 (object) 的特性可以在屬性 (properties) 中宣告。您可以宣告類別 (class) 的屬性 (properties)：

* 在類別名稱後面的括號 `()` 內。
```kotlin
class Contact(val id: Int, var email: String)
```

* 在由大括號 `{}` 定義的類別主體內。
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

我們建議您將屬性 (properties) 宣告為唯讀 (`val`)，除非它們需要在建立類別 (class) 的實例 (instance) 後進行變更。

您可以在括號內宣告沒有 `val` 或 `var` 的屬性 (properties)，但在建立實例 (instance) 後，這些屬性 (properties) 無法存取。

:::note
* 括號 `()` 內包含的內容稱為**類別標頭 (class header)**。
* 您可以在宣告類別屬性 (class properties) 時使用 [尾隨逗號 (trailing comma)](coding-conventions#trailing-commas)。

:::

就像函式參數一樣，類別屬性 (class properties) 可以具有預設值：
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## 建立實例 (Create instance)

若要從類別 (class) 建立物件 (object)，您可以使用**建構函式 (constructor)** 宣告類別**實例 (instance)**。

預設情況下，Kotlin 會自動建立一個建構函式 (constructor)，其參數在類別標頭 (class header) 中宣告。

例如：
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```

在範例中：

* `Contact` 是一個類別 (class)。
* `contact` 是 `Contact` 類別 (class) 的一個實例 (instance)。
* `id` 和 `email` 是屬性 (properties)。
* `id` 和 `email` 與預設建構函式 (default constructor) 一起用於建立 `contact`。

Kotlin 類別 (classes) 可以有多個建構函式 (constructors)，包括您自己定義的建構函式 (constructors)。若要瞭解更多關於如何宣告
多個建構函式 (constructors) 的資訊，請參閱 [建構函式 (Constructors)](classes#constructors)。

## 存取屬性 (Access properties)

若要存取實例 (instance) 的屬性 (property)，請在實例名稱後寫入屬性名稱，並附加句點 `.`：

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // Prints the value of the property: email
    println(contact.email)           
    // mary@gmail.com

    // Updates the value of the property: email
    contact.email = "jane@gmail.com"
    
    // Prints the new value of the property: email
    println(contact.email)           
    // jane@gmail.com
}
```

:::tip
若要將屬性 (property) 的值串連為字串的一部分，您可以使用字串模板 (`${}`)。
例如：
```kotlin
println("Their email address is: ${contact.email}")
```

:::

## 成員函式 (Member functions)

除了宣告屬性 (properties) 作為物件 (object) 特性的一部分之外，您還可以使用成員函式 (member functions) 定義物件 (object) 的行為。

在 Kotlin 中，成員函式 (member functions) 必須在類別主體內宣告。若要在實例 (instance) 上呼叫成員函式 (member function)，請在實例名稱後寫入函式名稱，並附加句點 `.`。例如：

```kotlin
class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    // Calls member function printId()
    contact.printId()           
    // 1
}
```

## 資料類別 (Data classes)

Kotlin 具有**資料類別 (data classes)**，它對於儲存資料特別有用。資料類別 (data classes) 具有與
類別 (classes) 相同的功能，但它們會自動帶有額外的成員函式 (member functions)。這些成員函式 (member functions) 讓您可以輕鬆地將
實例 (instance) 列印到可讀的輸出、比較類別 (class) 的實例 (instances)、複製實例 (instances) 等。由於這些函式是
自動可用的，因此您不必花時間為每個類別 (class) 編寫相同的樣板程式碼。

若要宣告資料類別 (data class)，請使用關鍵字 `data`：

```kotlin
data class User(val name: String, val id: Int)
```

資料類別 (data classes) 最有用的預定義成員函式 (predefined member functions) 是：

| **函式 (Function)**       | **描述 (Description)**                                                                          |
|--------------------|------------------------------------------------------------------------------------------|
| `toString()`       | 列印類別實例 (class instance) 及其屬性 (properties) 的可讀字串。                       |
| `equals()` or `==` | 比較類別 (class) 的實例 (instances)。                                                           |
| `copy()`           | 藉由複製另一個類別 (class) 來建立類別實例 (class instance)，可能具有一些不同的屬性 (properties)。 |

請參閱以下章節，瞭解如何使用每個函式的範例：

* [列印為字串 (Print as string)](#print-as-string)
* [比較實例 (Compare instances)](#compare-instances)
* [複製實例 (Copy instance)](#copy-instance)

### 列印為字串 (Print as string)

若要列印類別實例 (class instance) 的可讀字串，您可以明確呼叫 `toString()` 函式，或使用列印函式
（`println()` 和 `print()`），它們會自動為您呼叫 `toString()`：

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)
    
    // Automatically uses toString() function so that output is easy to read
    println(user)            
    // User(name=Alex, id=1)

}
```

這在偵錯或建立日誌時特別有用。

### 比較實例 (Compare instances)

若要比較資料類別實例 (data class instances)，請使用等號運算子 `==`：

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // Compares user to second user
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // Compares user to third user
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false

}
```

### 複製實例 (Copy instance)

若要建立資料類別實例 (data class instance) 的精確副本，請在該實例上呼叫 `copy()` 函式。

若要建立資料類別實例 (data class instance) 的副本**並**變更某些屬性 (properties)，請在該實例上呼叫 `copy()` 函式
**並**新增屬性 (properties) 的替換值作為函式參數。

例如：

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)

    // Creates an exact copy of user
    println(user.copy())       
    // User(name=Alex, id=1)

    // Creates a copy of user with name: "Max"
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // Creates a copy of user with id: 3
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)

}
```

建立實例 (instance) 的副本比修改原始實例 (original instance) 更安全，因為任何依賴
原始實例 (original instance) 的程式碼都不會受到副本以及您對其所做事情的影響。

有關資料類別 (data classes) 的更多資訊，請參閱 [資料類別 (Data classes)](data-classes)。

本導覽課程的最後一章是有關 Kotlin 的 [Null 安全性 (null safety)](kotlin-tour-null-safety)。

## 練習 (Practice)

### 練習 1

定義一個具有兩個屬性 (properties) 的資料類別 (data class) `Employee`：一個用於姓名，另一個用於薪水。請確保
薪水的屬性 (property) 是可變的，否則您將無法在年底獲得加薪！主函式 (main function) 示範了如何
可以使用這個資料類別 (data class)。

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

### 練習 2

宣告編譯此程式碼所需的額外資料類別 (data classes)。

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

### 練習 3

若要測試您的程式碼，您需要一個可以建立隨機員工的產生器。定義一個 `RandomEmployeeGenerator` 類別 (class)，其中包含
潛在名稱的固定清單（在類別主體內）。使用最小和最大薪水（在
類別標頭 (class header) 內）配置類別 (class)。在類別主體中，定義 `generateEmployee()` 函式。再次，主函式 (main function) 示範了
您可以使用此類別 (class)。

> 在此練習中，您匯入一個套件，以便可以使用 [`Random.nextInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/next-int.html) 函式。
> 有關匯入套件的更多資訊，請參閱 [套件和匯入 (Packages and imports)](packages)。
>

<h3>提示 1</h3>
        清單有一個名為 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html">`.random()`</a> 的擴充函式
        ，它會傳回清單中的隨機項目。
<h3>提示 2</h3>
        `Random.nextInt(from = ..., until = ...)` 為您提供指定限制內的隨機 `Int` 數字。
    

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

## 下一步 (Next step)

[Null 安全性 (Null safety)](kotlin-tour-null-safety)