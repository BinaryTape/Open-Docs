[//]: # (title: クラス)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-basic-types.md">基本型</a><br />
        <img src="icon-3-done.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-collections.md">コレクション</a><br />
        <img src="icon-4-done.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-control-flow.md">制御フロー</a><br />
        <img src="icon-5-done.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-functions.md">関数</a><br />
        <img src="icon-6.svg" width="20" alt="6番目のステップ" /> <strong>クラス</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="最後のステップ" /> <a href="kotlin-tour-null-safety.md">Null安全</a></p>
</tldr>

Kotlinは、クラスとオブジェクトを使ったオブジェクト指向プログラミングをサポートしています。オブジェクトは、プログラム内のデータを格納するのに役立ちます。
クラスを使用すると、オブジェクトの一連の特性を宣言できます。クラスからオブジェクトを作成すると、
これらの特性を毎回宣言する必要がないため、時間と労力を節約できます。

クラスを宣言するには、`class`キーワードを使用します。

```kotlin
class Customer
```

## プロパティ

クラスのオブジェクトの特性はプロパティで宣言できます。クラスのプロパティは次の場所で宣言できます。

* クラス名の後の括弧 `()` 内。
```kotlin
class Contact(val id: Int, var email: String)
```

* 波括弧 `{}` で定義されるクラス本体内。
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

クラスのインスタンスが作成された後に変更する必要がない限り、プロパティを読み取り専用 (`val`) として宣言することをお勧めします。

括弧内に`val`または`var`なしでプロパティを宣言できますが、これらのプロパティはインスタンスが作成された後にはアクセスできません。

> * 括弧 `()` 内に含まれる内容は**クラスヘッダー**と呼ばれます。
> * クラスプロパティを宣言する際に、[末尾のコンマ](coding-conventions.md#trailing-commas)を使用できます。
>
{style="note"}

関数パラメータと同様に、クラスプロパティにはデフォルト値を設定できます。
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## インスタンスの作成

クラスからオブジェクトを作成するには、**コンストラクタ**を使用してクラスの**インスタンス**を宣言します。

デフォルトでは、Kotlinはクラスヘッダーで宣言されたパラメータを持つコンストラクタを自動的に作成します。

例:
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-class-create-instance"}

例では:

* `Contact` はクラスです。
* `contact` は `Contact` クラスのインスタンスです。
* `id` と `email` はプロパティです。
* `id` と `email` はデフォルトコンストラクタで使用され、`contact` が作成されます。

Kotlinのクラスは、自分で定義したものを含め、多くのコンストラクタを持つことができます。複数のコンストラクタの宣言方法の詳細については、[コンストラクタ](classes.md#constructors)を参照してください。

## プロパティへのアクセス

インスタンスのプロパティにアクセスするには、インスタンス名の後にピリオド `.` を付けてプロパティ名を記述します。

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // プロパティ `email` の値を出力します。
    println(contact.email)           
    // mary@gmail.com

    // プロパティ `email` の値を更新します。
    contact.email = "jane@gmail.com"
    
    // プロパティ `email` の新しい値を出力します。
    println(contact.email)           
    // jane@gmail.com
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-access-property"}

> プロパティの値を文字列の一部として結合するには、文字列テンプレート (` `) を使用できます。
> 例:
> ```kotlin
> println("Their email address is: ${contact.email}")
> ```
>
{style="tip"}

## メンバー関数

オブジェクトの特性の一部としてプロパティを宣言することに加えて、メンバー関数を使ってオブジェクトの動作を定義することもできます。

Kotlinでは、メンバー関数はクラス本体内で宣言する必要があります。インスタンスでメンバー関数を呼び出すには、インスタンス名の後にピリオド `.` を付けて関数名を記述します。例:

```kotlin
class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    // メンバー関数 `printId()` を呼び出します。
    contact.printId()           
    // 1
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-member-function"}

## データクラス

Kotlinには、データの格納に特に便利な**データクラス**があります。データクラスはクラスと同じ機能を持っていますが、追加のメンバー関数が自動的に付属しています。これらのメンバー関数を使用すると、インスタンスを読みやすい出力に簡単に表示したり、クラスのインスタンスを比較したり、インスタンスをコピーしたりできます。これらの関数は自動的に利用できるため、各クラスで同じボイラープレートコードを作成する時間を費やす必要がありません。

データクラスを宣言するには、`data`キーワードを使用します。

```kotlin
data class User(val name: String, val id: Int)
```

データクラスの最も便利な事前定義されたメンバー関数は次のとおりです。

| **関数**           | **説明**                                                                                 |
|--------------------|------------------------------------------------------------------------------------------|
| `toString()`       | クラスインスタンスとそのプロパティを読みやすい文字列で出力します。                       |
| `equals()` または `==` | クラスのインスタンスを比較します。                                                           |
| `copy()`           | 別のクラスインスタンスをコピーして、プロパティの一部を変更する可能性があります。 |

各関数の使用例については、以下のセクションを参照してください。

* [文字列として出力](#print-as-string)
* [インスタンスの比較](#compare-instances)
* [インスタンスのコピー](#copy-instance)

### 文字列として出力

クラスインスタンスの読みやすい文字列を出力するには、明示的に`toString()`関数を呼び出すか、自動的に`toString()`を呼び出す`println()`や`print()`などのプリント関数を使用できます。

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    
    // `toString()`関数が自動的に使用され、出力が読みやすくなります。
    println(user)            
    // User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-print-string"}

これは、デバッグやログの作成時に特に役立ちます。

### インスタンスの比較

データクラスのインスタンスを比較するには、等価演算子`==`を使用します。

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // `user`と`secondUser`を比較します。
    println("user == secondUser: ${user == secondUser}") 
    // user == secondUser: true
    
    // `user`と`thirdUser`を比較します。
    println("user == thirdUser: ${user == thirdUser}")   
    // user == thirdUser: false
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-compare-instances"}

### インスタンスのコピー

データクラスインスタンスの正確なコピーを作成するには、インスタンスで`copy()`関数を呼び出します。

データクラスインスタンスのコピーを作成し、**かつ**一部のプロパティを変更するには、インスタンスで`copy()`関数を呼び出し、プロパティの置換値を関数パラメータとして追加します。

例:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)

    // `user`の正確なコピーを作成します。
    println(user.copy())       
    // User(name=Alex, id=1)

    // `name`が"Max"の`user`のコピーを作成します。
    println(user.copy("Max"))  
    // User(name=Max, id=1)

    // `id`が3の`user`のコピーを作成します。
    println(user.copy(id = 3)) 
    // User(name=Alex, id=3)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-copy-instance"}

インスタンスのコピーを作成することは、元のインスタンスを直接変更するよりも安全です。なぜなら、元のインスタンスに依存するコードが、コピーとその操作に影響されないためです。

データクラスの詳細については、[データクラス](data-classes.md)を参照してください。

このツアーの最後の章では、Kotlinの[Null安全](kotlin-tour-null-safety.md)について説明します。

## 練習

### 演習1 {initial-collapse-state="collapsed" collapsible="true"}

2つのプロパティを持つデータクラス`Employee`を定義してください。1つは名前用、もう1つは給与用です。給与のプロパティは変更可能であることを確認してください。そうしないと、年末に昇給が得られません！`main`関数は、このデータクラスの使用方法を示しています。

|---|---|
```kotlin
// ここにコードを記述してください

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-classes-solution-1"}

### 演習2 {initial-collapse-state="collapsed" collapsible="true"}

このコードがコンパイルされるために必要な追加のデータクラスを宣言してください。

|---|---|
```kotlin
data class Person(val name: Name, val address: Address, val ownsAPet: Boolean = true)
// ここにコードを記述してください
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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-classes-solution-2"}

### 演習3 {initial-collapse-state="collapsed" collapsible="true"}

コードをテストするには、ランダムな従業員を生成できるジェネレーターが必要です。固定された名前のリスト（クラス本体内）を持つ`RandomEmployeeGenerator`クラスを定義してください。クラスには最小および最大給与（クラスヘッダー内）を設定します。クラス本体内に`generateEmployee()`関数を定義してください。ここでも、`main`関数がこのクラスの使用方法を示しています。

> この演習では、[`Random.nextInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.random/-random/next-int.html)関数を使用できるようにパッケージをインポートします。
> パッケージのインポートに関する詳細については、[パッケージとインポート](packages.md)を参照してください。
>
{style="tip"}

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-1">
    <def title="ヒント1">
        リストには、リスト内のランダムな項目を返す[`random()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html)という拡張関数があります。
    </def>
</deflist>

<deflist collapsible="true" id="kotlin-tour-classes-exercise-3-hint-2">
    <def title="ヒント2">
        ``Random.nextInt(from = ..., until = ...)``は、指定された範囲内でランダムな`Int`数値を与えます。
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

// ここにコードを記述してください

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
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-classes-solution-3"}

## 次のステップ

[Null安全](kotlin-tour-null-safety.md)