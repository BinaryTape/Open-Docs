[//]: # (title: Intermediate: open クラスと特殊クラス)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="最初のステップ" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="2番目のステップ" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="3番目のステップ" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバ付きラムダ式</a><br />
        <img src="icon-4-done.svg" width="20" alt="4番目のステップ" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-done.svg" width="20" alt="5番目のステップ" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6.svg" width="20" alt="Fourth step" /> <strong>open クラスと特殊クラス</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="7番目のステップ" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="8番目のステップ" /> <a href="kotlin-tour-intermediate-null-safety.md">Null 安全</a><br />
        <img src="icon-9-todo.svg" width="20" alt="9番目のステップ" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリと API</a></p>
</tldr>

この章では、open クラス、open クラスがインターフェースとどのように連携するか、および Kotlin で利用できるその他の特殊な型のクラスについて学習します。

## open クラス

インターフェースや抽象クラスを使用できない場合は、クラスを **open** と宣言することで、明示的に継承可能にすることができます。
これを行うには、クラス宣言の前に `open` キーワードを使用します。

```kotlin
open class Vehicle(val make: String, val model: String)
```

別のクラスから継承するクラスを作成するには、クラスヘッダーの後にコロンを追加し、継承したい親クラスのコンストラクタを呼び出します。この例では、`Car` クラスが `Vehicle` クラスから継承しています。

```kotlin
open class Vehicle(val make: String, val model: String)

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

fun main() {
    // Car クラスのインスタンスを作成する
    val car = Car("Toyota", "Corolla", 4)

    // 車の詳細を出力する
    println("Car Info: Make - ${car.make}, Model - ${car.model}, Number of doors - ${car.numberOfDoors}")
    // Car Info: Make - Toyota, Model - Corolla, Number of doors - 4
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-open-class"}

通常のクラスインスタンスを作成する場合と同様に、クラスが親クラスを継承している場合、親クラスヘッダーで宣言されたすべてのパラメータを初期化する必要があります。したがって、この例では、`Car` クラスの `car` インスタンスは親クラスのパラメータ `make` と `model` を初期化しています。

### 継承した動作のオーバーライド

クラスを継承しても一部の動作を変更したい場合は、継承した動作をオーバーライドできます。

デフォルトでは、親クラスのメンバー関数やプロパティをオーバーライドすることはできません。抽象クラスと同様に、特別なキーワードを追加する必要があります。

#### メンバー関数

親クラスの関数をオーバーライドできるようにするには、親クラスでの宣言の前に `open` キーワードを使用します。

```kotlin
open fun displayInfo() {}
```
{validate="false"}

継承したメンバー関数をオーバーライドするには、子クラスの関数宣言の前に `override` キーワードを使用します。

```kotlin
override fun displayInfo() {}
```
{validate="false"}

例:

```kotlin
open class Vehicle(val make: String, val model: String) {
    open fun displayInfo() {
        println("Vehicle Info: Make - $make, Model - $model")
    }
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override fun displayInfo() {
        println("Car Info: Make - $make, Model - $model, Number of Doors - $numberOfDoors")
    }
}

fun main() {
    val car1 = Car("Toyota", "Corolla", 4)
    val car2 = Car("Honda", "Civic", 2)

    // オーバーライドされた displayInfo() 関数を使用する
    car1.displayInfo()
    // Car Info: Make - Toyota, Model - Corolla, Number of Doors - 4
    car2.displayInfo()
    // Car Info: Make - Honda, Model - Civic, Number of Doors - 2
}
```
{kotlin-runnable="true" id="kotlin-tour-class-override-function"}

この例では、以下を行います。

*   `Vehicle` クラスを継承する `Car` クラスのインスタンスを `car1` と `car2` の2つ作成します。
*   `Car` クラスの `displayInfo()` 関数をオーバーライドして、ドアの数も出力するようにします。
*   `car1` と `car2` のインスタンスでオーバーライドされた `displayInfo()` 関数を呼び出します。

#### プロパティ

Kotlin では、`open` キーワードを使用してプロパティを継承可能にし、後でオーバーライドすることは一般的なプラクティスではありません。ほとんどの場合、プロパティがデフォルトで継承される抽象クラスまたはインターフェースを使用します。

open クラス内のプロパティは子クラスからアクセス可能です。一般的に、新しいプロパティでオーバーライドするよりも、直接アクセスする方が良いです。

例えば、後でオーバーライドしたい `transmissionType` というプロパティがあるとします。プロパティをオーバーライドする構文は、メンバー関数をオーバーライドする構文とまったく同じです。次のようにすることができます。

```kotlin
open class Vehicle(val make: String, val model: String) {
    open val transmissionType: String = "Manual"
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override val transmissionType: String = "Automatic"
}
```

しかし、これは良いプラクティスではありません。代わりに、プロパティを継承可能なクラスのコンストラクタに追加し、`Car` 子クラスを作成するときにその値を宣言できます。

```kotlin
open class Vehicle(val make: String, val model: String, val transmissionType: String = "Manual")

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model, "Automatic")
```

プロパティをオーバーライドするのではなく直接アクセスすることで、よりシンプルで読みやすいコードになります。親クラスでプロパティを一度宣言し、コンストラクタを介してその値を渡すことで、子クラスで不要なオーバーライドを行う必要がなくなります。

クラスの継承とクラスの動作のオーバーライドに関する詳細は、[継承](inheritance.md)を参照してください。

### open クラスとインターフェース

クラスを継承し、**かつ**複数のインターフェースを実装するクラスを作成できます。この場合、コロンの後にまず親クラスを宣言し、その後にインターフェースをリストアップする必要があります。

```kotlin
// Define interfaces
interface EcoFriendly {
    val emissionLevel: String
}

interface ElectricVehicle {
    val batteryCapacity: Double
}

// Parent class
open class Vehicle(val make: String, val model: String)

// Child class
open class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

// New class that inherits from Car and implements two interfaces
class ElectricCar(
    make: String,
    model: String,
    numberOfDoors: Int,
    val capacity: Double,
    val emission: String
) : Car(make, model, numberOfDoors), EcoFriendly, ElectricVehicle {
    override val batteryCapacity: Double = capacity
    override val emissionLevel: String = emission
}
```

## 特殊クラス

抽象、open、データクラスに加えて、Kotlin には、特定の動作を制限したり、小さなオブジェクトを作成する際のパフォーマンスへの影響を軽減したりするなど、さまざまな目的のために設計された特殊な型のクラスがあります。

### シールドクラス

継承を制限したい場合があります。これはシールドクラス (sealed class) で行うことができます。シールドクラスは[抽象クラス](kotlin-tour-intermediate-classes-interfaces.md#abstract-classes)の特殊な型です。クラスがシールドと宣言されると、同じパッケージ内でのみ子クラスを作成できます。このスコープの外からシールドクラスを継承することはできません。

> パッケージとは、通常はディレクトリ内に、関連するクラスと関数を含むコードのコレクションです。Kotlin のパッケージについて詳しくは、[パッケージとインポート](packages.md)を参照してください。
>
{style="tip"}

シールドクラスを作成するには、`sealed` キーワードを使用します。

```kotlin
sealed class Mammal
```

シールドクラスは、`when` 式と組み合わせると特に便利です。`when` 式を使用することで、考えられるすべての子クラスの動作を定義できます。例:

```kotlin
sealed class Mammal(val name: String)

class Cat(val catName: String) : Mammal(catName)
class Human(val humanName: String, val job: String) : Mammal(humanName)

fun greetMammal(mammal: Mammal): String {
    when (mammal) {
        is Human -> return "Hello ${mammal.name}; You're working as a ${mammal.job}"
        is Cat -> return "Hello ${mammal.name}"   
    }
}

fun main() {
    println(greetMammal(Cat("Snowy")))
    // Hello Snowy
}
```
{kotlin-runnable="true" id="kotlin-tour-sealed-classes"}

この例では、以下を行います。

*   コンストラクタに `name` パラメータを持つ `Mammal` というシールドクラスがあります。
*   `Cat` クラスは `Mammal` シールドクラスから継承し、`Mammal` クラスの `name` パラメータを自身のコンストラクタの `catName` パラメータとして使用します。
*   `Human` クラスは `Mammal` シールドクラスから継承し、`Mammal` クラスの `name` パラメータを自身のコンストラクタの `humanName` パラメータとして使用します。また、コンストラクタに `job` パラメータも持ちます。
*   `greetMammal()` 関数は `Mammal` 型の引数を受け取り、文字列を返します。
*   `greetMammal()` 関数の本体内には、[`is` 演算子](typecasts.md#is-and-is-operators)を使用して `mammal` の型をチェックし、実行するアクションを決定する `when` 式があります。
*   `main()` 関数は、`Cat` クラスのインスタンスと `Snowy` という `name` パラメータを指定して `greetMammal()` 関数を呼び出します。

> このツアーでは、[Null 安全](kotlin-tour-intermediate-null-safety.md)の章で `is` 演算子について詳しく説明します。
>
{style ="tip"}

シールドクラスとその推奨されるユースケースに関する詳細は、[シールドクラスとインターフェース](sealed-classes.md)を参照してください。

### 列挙クラス

列挙クラス (enum class) は、クラス内で有限の異なる値のセットを表現したい場合に便利です。列挙クラスには列挙定数 (enum constants) が含まれており、それ自体が列挙クラスのインスタンスです。

列挙クラスを作成するには、`enum` キーワードを使用します。

```kotlin
enum class State
```

プロセスごとの異なる状態を含む列挙クラスを作成したいとします。各列挙定数はカンマ `,` で区切る必要があります。

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}
```

`State` 列挙クラスには、`IDLE`、`RUNNING`、`FINISHED` という列挙定数があります。列挙定数にアクセスするには、クラス名の後に `.` と列挙定数の名前を使用します。

```kotlin
val state = State.RUNNING
```

この列挙クラスを `when` 式で使用して、列挙定数の値に応じて実行するアクションを定義できます。

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}

fun main() {
    val state = State.RUNNING
    val message = when (state) {
        State.IDLE -> "It's idle"
        State.RUNNING -> "It's running"
        State.FINISHED -> "It's finished"
    }
    println(message)
    // It's running
}
```
{kotlin-runnable="true" id="kotlin-tour-enum-classes"}

列挙クラスは、通常のクラスと同様にプロパティやメンバー関数を持つことができます。

例えば、HTML を扱っていて、いくつかの色を含む列挙クラスを作成したいとします。各色に、その RGB 値を16進数で含む `rgb` というプロパティを持たせたいとします。列挙定数を作成する際には、このプロパティで初期化する必要があります。

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00)
}
```

> Kotlin は16進数を整数として保存するため、`rgb` プロパティは `Int` 型であり、`String` 型ではありません。
>
{style="note"}

このクラスにメンバー関数を追加するには、列挙定数とセミコロン `;` で区切ります。

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00);

    fun containsRed() = (this.rgb and 0xFF0000 != 0)
}

fun main() {
    val red = Color.RED
    
    // 列挙定数に対して containsRed() 関数を呼び出す
    println(red.containsRed())
    // true

    // クラス名を介して列挙定数に対して containsRed() 関数を呼び出す
    println(Color.BLUE.containsRed())
    // false
  
    println(Color.YELLOW.containsRed())
    // true
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-enum-classes-members"}

この例では、`containsRed()` メンバー関数は、列挙定数の `rgb` プロパティの値を `this` キーワードを使用してアクセスし、16進数の値に `FF` が最初のビットとして含まれているかをチェックしてブール値を返します。

詳細については、[列挙クラス](enum-classes.md)を参照してください。

### インライン値クラス

コード内で、クラスから小さなオブジェクトを作成し、それを一時的にだけ使用したい場合があります。このアプローチはパフォーマンスに影響を与える可能性があります。インライン値クラス (inline value class) は、このパフォーマンスへの影響を回避する特殊な型のクラスです。ただし、値のみを含むことができます。

インライン値クラスを作成するには、`value` キーワードと `@JvmInline` アノテーションを使用します。

```kotlin
@JvmInline
value class Email
```

> `@JvmInline` アノテーションは、Kotlin がコンパイルされるときにコードを最適化するように指示します。詳細については、[アノテーション](annotations.md)を参照してください。
>
{style="tip"}

インライン値クラスは、クラスヘッダーで初期化される単一のプロパティを**持たなければなりません**。

メールアドレスを収集するクラスを作成したいとします。

```kotlin
// address プロパティはクラスヘッダーで初期化されます。
@JvmInline
value class Email(val address: String)

fun sendEmail(email: Email) {
    println("Sending email to ${email.address}")
}

fun main() {
    val myEmail = Email("example@example.com")
    sendEmail(myEmail)
    // Sending email to example@example.com
}
```
{kotlin-runnable="true" id="kotlin-tour-inline-value-class"}

この例では、以下を行います。

*   `Email` は、クラスヘッダーに `address` というプロパティを1つ持つインライン値クラスです。
*   `sendEmail()` 関数は `Email` 型のオブジェクトを受け取り、標準出力に文字列を出力します。
*   `main()` 関数は、以下を行います。
    *   `myEmail` という `Email` クラスのインスタンスを作成します。
    *   `myEmail` オブジェクトに対して `sendEmail()` 関数を呼び出します。

インライン値クラスを使用することで、クラスをインライン化し、オブジェクトを作成することなくコードで直接使用できるようになります。これにより、メモリフットプリントを大幅に削減し、コードのランタイムパフォーマンスを向上させることができます。

インライン値クラスに関する詳細は、[インライン値クラス](inline-classes.md)を参照してください。

## 練習

### 練習問題 1 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-1"}

配送サービスを管理しており、パッケージのステータスを追跡する方法が必要です。`DeliveryStatus` というシールドクラスを作成し、`Pending`、`InTransit`、`Delivered`、`Canceled` の各ステータスを表すデータクラスを含めます。`main()` 関数のコードが正常に実行されるように、`DeliveryStatus` クラスの宣言を完成させてください。

|---|---|

```kotlin
sealed class // ここにコードを記述

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    // The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // The delivery was canceled due to: Address not found.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-1"}

|---|---|
```kotlin
sealed class DeliveryStatus {
    data class Pending(val sender: String) : DeliveryStatus()
    data class InTransit(val estimatedDeliveryDate: String) : DeliveryStatus()
    data class Delivered(val deliveryDate: String, val recipient: String) : DeliveryStatus()
    data class Canceled(val reason: String) : DeliveryStatus()
}

fun printDeliveryStatus(status: DeliveryStatus) {
    when (status) {
        is DeliveryStatus.Pending -> {
            println("The package is pending pickup from ${status.sender}.")
        }
        is DeliveryStatus.InTransit -> {
            println("The package is in transit and expected to arrive by ${status.estimatedDeliveryDate}.")
        }
        is DeliveryStatus.Delivered -> {
            println("The package was delivered to ${status.recipient} on ${status.deliveryDate}.")
        }
        is DeliveryStatus.Canceled -> {
            println("The delivery was canceled due to: ${status.reason}.")
        }
    }
}

fun main() {
    val status1: DeliveryStatus = DeliveryStatus.Pending("Alice")
    val status2: DeliveryStatus = DeliveryStatus.InTransit("2024-11-20")
    val status3: DeliveryStatus = DeliveryStatus.Delivered("2024-11-18", "Bob")
    val status4: DeliveryStatus = DeliveryStatus.Canceled("Address not found")

    printDeliveryStatus(status1)
    // The package is pending pickup from Alice.
    printDeliveryStatus(status2)
    // The package is in transit and expected to arrive by 2024-11-20.
    printDeliveryStatus(status3)
    // The package was delivered to Bob on 2024-11-18.
    printDeliveryStatus(status4)
    // The delivery was canceled due to: Address not found.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-special-classes-solution-1"}

### 練習問題 2 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-2"}

プログラムで、さまざまなステータスと種類のエラーを処理できるようにしたいと考えています。データクラスまたはオブジェクトで宣言された異なるステータスを捕捉するためのシールドクラスがあります。以下のコードを完成させ、`NETWORK`、`TIMEOUT`、`UNKNOWN` の異なる問題タイプを表す `Problem` という列挙クラスを作成してください。

|---|---|

```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        // ここにコードを記述
    }

    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    // Network issue
    handleStatus(status2)
    // Data received: [Data1, Data2]
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-special-classes-exercise-2"}

|---|---|
```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        enum class Problem {
            NETWORK,
            TIMEOUT,
            UNKNOWN
        }
    }

    data class OK(val data: List<String>) : Status()
}

fun handleStatus(status: Status) {
    when (status) {
        is Status.Loading -> println("Loading...")
        is Status.OK -> println("Data received: ${status.data}")
        is Status.Error -> when (status.problem) {
            Status.Error.Problem.NETWORK -> println("Network issue")
            Status.Error.Problem.TIMEOUT -> println("Request timed out")
            Status.Error.Problem.UNKNOWN -> println("Unknown error occurred")
        }
    }
}

fun main() {
    val status1: Status = Status.Error(Status.Error.Problem.NETWORK)
    val status2: Status = Status.OK(listOf("Data1", "Data2"))

    handleStatus(status1)
    // Network issue
    handleStatus(status2)
    // Data received: [Data1, Data2]
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-special-classes-solution-2"}

## 次のステップ

[Intermediate: プロパティ](kotlin-tour-intermediate-properties.md)