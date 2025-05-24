---
title: クラス
---
<no-index/>
:::info
<p>
   <img src="/img/icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-hello-world">Hello world</a><br />
        <img src="/img/icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-basic-types">Basic types（基本型）</a><br />
        <img src="/img/icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-collections">Collections（コレクション）</a><br />
        <img src="/img/icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-control-flow">Control flow（制御フロー）</a><br />
        <img src="/img/icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-functions">Functions（関数）</a><br />
        <img src="/img/icon-6.svg" width="20" alt="Sixth step" /> <strong>Classes（クラス）</strong><br />
        <img src="/img/icon-7-todo.svg" width="20" alt="Final step" /> <a href="kotlin-tour-null-safety">Null safety（Null安全）</a>
</p>

:::

Kotlinは、クラスとオブジェクトによるオブジェクト指向プログラミングをサポートしています。オブジェクトは、プログラムでデータを格納するのに役立ちます。
クラスを使用すると、オブジェクトの一連の特性を宣言できます。クラスからオブジェクトを作成すると、毎回これらの特性を宣言する必要がないため、時間と労力を節約できます。

クラスを宣言するには、`class` キーワードを使用します。

```kotlin
class Customer
```

## Properties（プロパティ）

クラスのオブジェクトの特性は、プロパティで宣言できます。クラスのプロパティは、次のように宣言できます。

* クラス名の後の括弧 `()` 内。
```kotlin
class Contact(val id: Int, var email: String)
```

* 波括弧`{}`で定義されたクラス本体内。
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

クラスのインスタンスが作成された後に変更する必要がない限り、プロパティを読み取り専用 (`val`) として宣言することをお勧めします。

括弧内に `val` または `var` なしでプロパティを宣言できますが、これらのプロパティはインスタンスの作成後はアクセスできません。

:::note
* 括弧 `()` 内に含まれるコンテンツは、**class header（クラスヘッダー）**と呼ばれます。
* クラスのプロパティを宣言するときに、[trailing comma（末尾のカンマ）](coding-conventions#trailing-commas)を使用できます。

:::

関数のパラメーターと同様に、クラスのプロパティはデフォルト値を持つことができます。
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## Create instance（インスタンスの作成）

クラスからオブジェクトを作成するには、**constructor（コンストラクター）**を使用してクラス**instance（インスタンス）**を宣言します。

デフォルトでは、Kotlinはクラスヘッダーで宣言されたパラメーターを持つコンストラクターを自動的に作成します。

例：
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```

この例では：

* `Contact` はクラスです。
* `contact` は `Contact` クラスのインスタンスです。
* `id` と `email` はプロパティです。
* `id` と `email` はデフォルトのコンストラクターで使用され、`contact` が作成されます。

Kotlinのクラスは、自分で定義したものを含め、多数のコンストラクターを持つことができます。複数のコンストラクターを宣言する方法の詳細については、[Constructors（コンストラクター）](classes#constructors)を参照してください。

## Access properties（プロパティへのアクセス）

インスタンスのプロパティにアクセスするには、インスタンス名の後にピリオド `.` を追加し、その後にプロパティの名前を記述します。

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // プロパティの値を出力: email
    println(contact.email)           
    // mary@gmail.com

    // プロパティの値を更新: email
    contact.email = "jane@gmail.com"
    
    // プロパティの新しい値を出力: email
    println(contact.email)           
    // jane@gmail.com
}
```

:::tip
プロパティの値を文字列の一部として連結するには、文字列テンプレート（`$property` または `${property}`）を使用できます。
例：
```kotlin
println("Their email address is: ${contact.email}")
```

:::

## Member functions（メンバー関数）

オブジェクトの特性の一部としてプロパティを宣言するだけでなく、member functions（メンバー関数）を使用してオブジェクトの動作を定義することもできます。

Kotlinでは、メンバー関数はクラス本体内で宣言する必要があります。インスタンスでメンバー関数を呼び出すには、インスタンス名の後にピリオド `.` を追加し、その後に関数名を記述します。例：

```kotlin
class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    // メンバー関数 printId() を呼び出す
    contact.printId()           
    // 1
}
```

## Data classes（データクラス）

Kotlinには、データの格納に特に役立つ **data classes（データクラス）**があります。データクラスはクラスと同じ機能を持ちますが、追加のメンバー関数が自動的に付属しています。これらのメンバー関数を使用すると、インスタンスを読みやすい出力に出力したり、クラスのインスタンスを比較したり、インスタンスをコピーしたりするのが簡単になります。これらの関数は自動的に利用できるため、クラスごとに同じboilerplate code（ボイラープレートコード）を作成する時間を費やす必要はありません。

データクラスを宣言するには、キーワード`data`を使用します。

```kotlin
data class User(val name: String, val id: Int)
```

データクラスの最も有用な定義済みメンバー関数は次のとおりです。

| **Function（関数）**       | **Description（説明）**                                                                          |
|--------------------|------------------------------------------------------------------------------------------|
| `toString()`       | クラスインスタンスとそのプロパティの読みやすい文字列を出力します。                       |
| `equals()` or `==` | クラスのインスタンスを比較します。                                                           |
| `copy()`           | 別のクラスをコピーしてクラスインスタンスを作成します。場合によっては、異なるプロパティを持つこともあります。 |

各関数の使用方法の例については、次のセクションを参照してください。

* [Print as string（文字列として出力）](#print-as-string)
* [Compare instances（インスタンスの比較）](#compare-instances)
* [Copy instance（インスタンスのコピー）](#copy-instance)

### Print as string（文字列として出力）

クラスインスタンスの読みやすい文字列を出力するには、`toString()` 関数を明示的に呼び出すか、print functions（print関数）（`println()` と `print()`）を使用します。これにより、`toString()` が自動的に呼び出されます。

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)
    
    // toString() 関数を自動的に使用するため、出力は読みやすくなります
    println(user)            
    // User(name=Alex, id=1)

}
```

これは、デバッグまたはログの作成時に特に役立ちます。

### Compare instances（インスタンスの比較）

データクラスインスタンスを比較するには、等価演算子 `==` を使用します。

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // user と secondUser を比較
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // user と thirdUser を比較
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false

}
```

### Copy instance（インスタンスのコピー）

データクラスインスタンスの正確なコピーを作成するには、インスタンスで `copy()` 関数を呼び出します。

データクラスインスタンスのコピーを作成し、**かつ**いくつかのプロパティを変更するには、インスタンスで `copy()` 関数を呼び出し、**かつ**関数パラメーターとしてプロパティの置換値を追加します。

例：

```kotlin
data class User(val name: String, val id: Int)

fun main() {

    val user = User("Alex", 1)

    // user の正確なコピーを作成
    println(user.copy())       
    // User(name=Alex, id=1)

    // name: "Max" を持つ user のコピーを作成
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // id: 3 を持つ user のコピーを作成
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)

}
```

インスタンスのコピーを作成することは、元のインスタンスを変更するよりも安全です。これは、元のインスタンスに依存するコードは、コピーとそれに対して行うことの影響を受けないためです。

データクラスの詳細については、[Data classes（データクラス）](data-classes)を参照してください。

このツアーの最後の章は、Kotlinの[Null safety（Null安全）](kotlin-tour-null-safety)についてです。

## Practice（練習）

### Exercise 1（演習 1）

2つのプロパティ（名前用と給与用）を持つデータクラス `Employee` を定義します。給与のプロパティは可変であることを確認してください。そうしないと、年末に給与の引き上げを受けることができません。main関数は、このデータクラスの使用方法を示しています。

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

### Exercise 2（演習 2）

このコードをコンパイルするために必要な追加のデータクラスを宣言します。

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

### Exercise 3（演習 3）

コードをテストするには、ランダムな従業員を作成できるジェネレーターが必要です。潜在的な名前の固定リスト（クラス本体内）を持つ `RandomEmployeeGenerator` クラスを定義します。最小給与と最大給与（クラスヘッダー内）でクラスを構成します。クラス本体で、`generateEmployee()` 関数を定義します。繰り返しますが、main関数は、このクラスの使用方法を示しています。

> この演習では、[`Random.nextInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/next-int.html)関数を使用できるように、パッケージをインポートします。
> パッケージのインポートの詳細については、[Packages and imports（パッケージとインポート）](packages)を参照してください。
>

<h3>Hint 1（ヒント 1）</h3>
        リストには、リスト内のランダムなアイテムを返す<a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html">`.random()`</a>と呼ばれる拡張関数があります。
<h3>Hint 2（ヒント 2）</h3>
        `Random.nextInt(from = ..., until = ...)` は、指定された制限内のランダムな `Int` 数を提供します。
    

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

## Next step（次のステップ）

[Null safety（Null安全）](kotlin-tour-null-safety)