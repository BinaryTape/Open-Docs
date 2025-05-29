[//]: # (title: 中級: オープンクラスと特殊なクラス)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバ付きラムダ式</a><br />
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br />
        <img src="icon-5-done.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6.svg" width="20" alt="Fourth step" /> <strong>オープンクラスと特殊なクラス</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

この章では、オープンクラス、それがインターフェースとどのように連携するか、そしてKotlinで利用できるその他の特殊なクラスについて学びます。

## オープンクラス

インターフェースや抽象クラスを使用できない場合、クラスを**オープン**として宣言することで、明示的に継承可能にできます。これを行うには、クラス宣言の前に`open`キーワードを使用します。

```kotlin
open class Vehicle
```

別のクラスを継承するクラスを作成するには、クラスヘッダーの後にコロンを追加し、継承したい親クラスのコンストラクタを呼び出します。

```kotlin
class Car : Vehicle
```
{validate="false"}

この例では、`Car`クラスが`Vehicle`クラスを継承しています。

```kotlin
open class Vehicle(val make: String, val model: String)

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model)

fun main() {
    // Creates an instance of the Car class
    val car = Car("Toyota", "Corolla", 4)

    // Prints the details of the car
    println("Car Info: Make - ${car.make}, Model - ${car.model}, Number of doors - ${car.numberOfDoors}")
    // Car Info: Make - Toyota, Model - Corolla, Number of doors - 4
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-open-class"}

通常のクラスインスタンスを作成する場合と同様に、クラスが親クラスを継承する場合、親クラスのヘッダーで宣言されているすべてのパラメータを初期化する必要があります。したがって、この例では、`Car`クラスの`car`インスタンスは、親クラスのパラメータである`make`と`model`を初期化します。

### 継承された動作のオーバーライド

クラスを継承しつつ、その一部の動作を変更したい場合、継承された動作をオーバーライドできます。

デフォルトでは、親クラスのメンバ関数やプロパティをオーバーライドすることはできません。抽象クラスと同様に、特別なキーワードを追加する必要があります。

#### メンバ関数

親クラスの関数をオーバーライド可能にするには、親クラスでの宣言の前に`open`キーワードを使用します。

```kotlin
open fun displayInfo() {}
```
{validate="false"}

継承されたメンバ関数をオーバーライドするには、子クラスの関数宣言の前に`override`キーワードを使用します。

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

    // Uses the overridden displayInfo() function
    car1.displayInfo()
    // Car Info: Make - Toyota, Model - Corolla, Number of Doors - 4
    car2.displayInfo()
    // Car Info: Make - Honda, Model - Civic, Number of Doors - 2
}
```
{kotlin-runnable="true" id="kotlin-tour-class-override-function"}

この例では、

*   `Vehicle`クラスを継承する`Car`クラスの2つのインスタンス`car1`と`car2`を作成します。
*   `Car`クラスの`displayInfo()`関数をオーバーライドして、ドアの数も出力するようにします。
*   `car1`と`car2`インスタンスでオーバーライドされた`displayInfo()`関数を呼び出します。

#### プロパティ

Kotlinでは、`open`キーワードを使用してプロパティを継承可能にし、後でオーバーライドすることは一般的なプラクティスではありません。ほとんどの場合、プロパティがデフォルトで継承可能である抽象クラスやインターフェースを使用します。

オープンクラス内のプロパティは、その子クラスからアクセス可能です。一般的に、新しいプロパティでそれらをオーバーライドするよりも、直接アクセスする方が良いです。

たとえば、後でオーバーライドしたい`transmissionType`というプロパティがあるとします。プロパティをオーバーライドする構文は、メンバ関数をオーバーライドする場合とまったく同じです。次のようにできます。

```kotlin
open class Vehicle(val make: String, val model: String) {
    open val transmissionType: String = "Manual"
}

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model) {
    override val transmissionType: String = "Automatic"
}
```

しかし、これは良いプラクティスではありません。代わりに、継承可能なクラスのコンストラクタにプロパティを追加し、`Car`子クラスを作成するときにその値を宣言できます。

```kotlin
open class Vehicle(val make: String, val model: String, val transmissionType: String = "Manual")

class Car(make: String, model: String, val numberOfDoors: Int) : Vehicle(make, model, "Automatic")
```

プロパティをオーバーライドするのではなく直接アクセスすることで、よりシンプルで読みやすいコードになります。プロパティを親クラスで一度宣言し、コンストラクタを通じてその値を渡すことで、子クラスでの不要なオーバーライドの必要がなくなります。

クラスの継承とクラスの動作のオーバーライドに関する詳細は、[継承](inheritance.md)を参照してください。

### オープンクラスとインターフェース

クラスを継承し、**かつ**複数のインターフェースを実装するクラスを作成できます。この場合、コロンの後で、インターフェースを列挙する前に、まず親クラスを宣言する必要があります。

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

## 特殊なクラス

抽象クラス、オープンクラス、データクラスに加えて、Kotlinには特定の動作を制限したり、小さなオブジェクトを作成する際のパフォーマンスへの影響を軽減したりするなど、様々な目的のために設計された特殊な種類のクラスがあります。

### Sealedクラス

継承を制限したい場合があります。これはsealedクラスで実現できます。sealedクラスは[抽象クラス](kotlin-tour-intermediate-classes-interfaces.md#abstract-classes)の特殊な型です。クラスをsealedとして宣言すると、同じパッケージ内でのみその子クラスを作成できます。このスコープ外からsealedクラスを継承することはできません。

> パッケージは、関連するクラスや関数を含むコードの集まりで、通常はディレクトリ内にあります。Kotlinのパッケージについて詳しくは、[パッケージとインポート](packages.md)を参照してください。
>
{style="tip"}

sealedクラスを作成するには、`sealed`キーワードを使用します。

```kotlin
sealed class Mammal
```

sealedクラスは、`when`式と組み合わせると特に便利です。`when`式を使用すると、考えられるすべての子クラスの動作を定義できます。例:

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

この例では、

*   コンストラクタに`name`パラメータを持つ`Mammal`というsealedクラスがあります。
*   `Cat`クラスは`Mammal` sealedクラスを継承し、`Mammal`クラスの`name`パラメータを自身のコンストラクタの`catName`パラメータとして使用します。
*   `Human`クラスは`Mammal` sealedクラスを継承し、`Mammal`クラスの`name`パラメータを自身のコンストラクタの`humanName`パラメータとして使用します。また、自身のコンストラクタには`job`パラメータがあります。
*   `greetMammal()`関数は`Mammal`型の引数を受け取り、文字列を返します。
*   `greetMammal()`関数の本体内には、`when`式があり、[`is`演算子](typecasts.md#is-and-is-operators)を使用して`mammal`の型をチェックし、実行するアクションを決定します。
*   `main()`関数は、`Cat`クラスのインスタンスと`Snowy`という`name`パラメータを指定して`greetMammal()`関数を呼び出します。

> このツアーでは、[Null安全性](kotlin-tour-intermediate-null-safety.md)の章で`is`演算子について詳しく説明します。
>
{style ="tip"}

sealedクラスとその推奨されるユースケースに関する詳細は、[Sealedクラスとインターフェース](sealed-classes.md)を参照してください。

### Enumクラス

Enumクラスは、クラス内で有限の異なる値のセットを表現したい場合に便利です。enumクラスにはenum定数が含まれており、それ自体がenumクラスのインスタンスです。

enumクラスを作成するには、`enum`キーワードを使用します。

```kotlin
enum class State
```

プロセスの異なる状態を含むenumクラスを作成したいとします。各enum定数はコンマ`,`で区切る必要があります。

```kotlin
enum class State {
    IDLE, RUNNING, FINISHED
}
```

`State` enumクラスには、`IDLE`、`RUNNING`、`FINISHED`というenum定数があります。enum定数にアクセスするには、クラス名の後に`.`とenum定数の名前を使用します。

```kotlin
val state = State.RUNNING
```

このenumクラスを`when`式と組み合わせて使用​​すると、enum定数の値に応じて実行するアクションを定義できます。

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

Enumクラスは、通常のクラスと同様にプロパティやメンバ関数を持つことができます。

たとえば、HTMLを扱っていて、いくつかの色を含むenumクラスを作成したいとします。各色に、そのRGB値を16進数で含む`rgb`というプロパティを持たせたいとします。enum定数を作成する際には、このプロパティで初期化する必要があります。

```kotlin
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF),
    YELLOW(0xFFFF00)
}
```

> Kotlinは16進数を整数として保存するため、`rgb`プロパティは`Int`型であり、`String`型ではありません。
>
{style="note"}

このクラスにメンバ関数を追加するには、enum定数とセミコロン`;`で区切ります。

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
    
    // Calls containsRed() function on enum constant
    println(red.containsRed())
    // true

    // Calls containsRed() function on enum constants via class names
    println(Color.BLUE.containsRed())
    // false
  
    println(Color.YELLOW.containsRed())
    // true
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-enum-classes-members"}

この例では、`containsRed()`メンバ関数は`this`キーワードを使用してenum定数の`rgb`プロパティの値にアクセスし、16進数値の最初のビットに`FF`が含まれているかどうかをチェックしてブール値を返します。

詳細は、[Enumクラス](enum-classes.md)を参照してください。

### インライン値クラス

コードで、クラスから小さなオブジェクトを作成し、短期間だけ使用したい場合があります。このアプローチはパフォーマンスに影響を与える可能性があります。インライン値クラスは、このパフォーマンスへの影響を回避する特殊な型のクラスです。ただし、それらは値のみを含むことができます。

インライン値クラスを作成するには、`value`キーワードと`@JvmInline`アノテーションを使用します。

```kotlin
@JvmInline
value class Email
```

> `@JvmInline`アノテーションは、コンパイル時にKotlinにコードを最適化するよう指示します。詳細については、[アノテーション](annotations.md)を参照してください。
>
{style="tip"}

インライン値クラスは、クラスヘッダーで初期化された単一のプロパティを**必ず**持たなければなりません。

メールアドレスを収集するクラスを作成したいとします。

```kotlin
// The address property is initialized in the class header.
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

この例では、

*   `Email`は、クラスヘッダーに`address`という1つのプロパティを持つインライン値クラスです。
*   `sendEmail()`関数は`Email`型のオブジェクトを受け入れ、文字列を標準出力に出力します。
*   `main()`関数は以下を実行します。
    *   `email`という`Email`クラスのインスタンスを作成します。
    *   `email`オブジェクトで`sendEmail()`関数を呼び出します。

インライン値クラスを使用することで、クラスがインライン化され、オブジェクトを作成せずにコードで直接使用できます。これにより、メモリフットプリントを大幅に削減し、コードの実行時パフォーマンスを向上させることができます。

インライン値クラスに関する詳細は、[インライン値クラス](inline-classes.md)を参照してください。

## 練習

### 演習1 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-1"}

配達サービスを管理しており、荷物のステータスを追跡する方法が必要です。`DeliveryStatus`というsealedクラスを作成し、`Pending`、`InTransit`、`Delivered`、`Canceled`の各ステータスを表すデータクラスを含めます。`main()`関数のコードが正常に実行されるように、`DeliveryStatus`クラスの宣言を完成させてください。

|---|---|

```kotlin
sealed class // Write your code here

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

### 演習2 {initial-collapse-state="collapsed" collapsible="true" id="special-classes-exercise-2"}

プログラムで、さまざまなステータスとエラーの種類を処理できるようにしたいと考えています。データクラスまたはオブジェクトで宣言された異なるステータスをキャプチャするためのsealedクラスがあります。以下のコードを、異なる問題の種類である`NETWORK`、`TIMEOUT`、`UNKNOWN`を表す`Problem`というenumクラスを作成して完成させてください。

|---|---|

```kotlin
sealed class Status {
    data object Loading : Status()
    data class Error(val problem: Problem) : Status() {
        // Write your code here
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

[中級: プロパティ](kotlin-tour-intermediate-properties.md)