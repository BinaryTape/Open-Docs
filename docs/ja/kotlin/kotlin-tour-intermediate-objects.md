[//]: # (title: 中級: オブジェクト)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバ付きラムダ式</a><br /> 
        <img src="icon-4-done.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">クラスとインターフェース</a><br /> 
        <img src="icon-5.svg" width="20" alt="Fourth step" /> <strong>オブジェクト</strong><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">`open`クラスと特殊クラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

この章では、オブジェクト宣言を探求することで、クラスの理解を深めます。この知識は、プロジェクト全体の動作を効率的に管理するのに役立ちます。

## オブジェクト宣言

Kotlinでは、**オブジェクト宣言**を使用して、単一のインスタンスを持つクラスを宣言できます。ある意味で、クラスを宣言すると同時に、その単一のインスタンスが作成されます。オブジェクト宣言は、プログラムの単一の参照点として使用するクラスを作成したり、システム全体の動作を調整したりする場合に役立ちます。

> 簡単にアクセスできる単一のインスタンスのみを持つクラスは、**シングルトン**と呼ばれます。
>
{style="tip"}

Kotlinのオブジェクトは**遅延的**であり、アクセスされたときにのみ作成されます。Kotlinはまた、すべてのオブジェクトがスレッドセーフな方法で作成されることを保証するため、手動でこれを確認する必要はありません。

オブジェクト宣言を作成するには、`object`キーワードを使用します。

```kotlin
object DoAuth {}
```

`object`の名前の後に、波括弧`{}`で定義されたオブジェクト本体内に任意のプロパティまたはメンバ関数を追加します。

> オブジェクトはコンストラクタを持つことができないため、クラスのようなヘッダを持ちません。
>
{style="note"}

たとえば、認証を担当する`DoAuth`というオブジェクトを作成したいとします。

```kotlin
object DoAuth {
    fun takeParams(username: String, password: String) {
        println("input Auth parameters = $username:$password")
    }
}

fun main(){
    // takeParams() 関数が呼び出されたときにオブジェクトが作成されます
    DoAuth.takeParams("coding_ninja", "N1njaC0ding!")
    // input Auth parameters = coding_ninja:N1njaC0ding!
}
```
{kotlin-runnable="true" id="kotlin-tour-object-declarations"}

このオブジェクトには、`username`と`password`変数をパラメータとして受け取り、コンソールに文字列を返す`takeParams`というメンバ関数があります。`DoAuth`オブジェクトは、関数が最初に呼び出されたときにのみ作成されます。

> オブジェクトはクラスやインターフェースを継承できます。例:
> 
> ```kotlin
> interface Auth {
>     fun takeParams(username: String, password: String)
> }
>
> object DoAuth : Auth {
>     override fun takeParams(username: String, password: String) {
>         println("input Auth parameters = $username:$password")
>     }
> }
> ```
>
{style="note"}

#### データオブジェクト

オブジェクト宣言の内容を簡単に表示できるようにするために、Kotlinには**データオブジェクト**があります。初心者ツアーで学習したデータクラスと同様に、データオブジェクトには`toString()`や`equals()`などの追加のメンバ関数が自動的に付属しています。

> データクラスとは異なり、データオブジェクトは単一のインスタンスしか持たずコピーできないため、`copy()`メンバ関数は自動的に付属しません。
>
{type ="note"}

データオブジェクトを作成するには、オブジェクト宣言と同じ構文を使用しますが、`data`キーワードをプレフィックスとして付けます。

```kotlin
data object AppConfig {}
```

例:

```kotlin
data object AppConfig {
    var appName: String = "My Application"
    var version: String = "1.0.0"
}

fun main() {
    println(AppConfig)
    // AppConfig
    
    println(AppConfig.appName)
    // My Application
}
```
{kotlin-runnable="true" id="kotlin-tour-data-objects"}

データオブジェクトの詳細については、[](object-declarations.md#data-objects)を参照してください。

#### コンパニオンオブジェクト

Kotlinでは、クラスはオブジェクト、つまり**コンパニオンオブジェクト**を持つことができます。1つのクラスにつき**1つ**のコンパニオンオブジェクトしか持てません。コンパニオンオブジェクトは、そのクラスが最初に参照されたときにのみ作成されます。

コンパニオンオブジェクト内で宣言されたプロパティや関数は、すべてのクラスインスタンスで共有されます。

クラス内にコンパニオンオブジェクトを作成するには、オブジェクト宣言と同じ構文を使用しますが、`companion`キーワードをプレフィックスとして付けます。

```kotlin
companion object Bonger {}
```

> コンパニオンオブジェクトに名前を付ける必要はありません。名前を定義しない場合、デフォルトは`Companion`になります。
> 
{style="note"}

コンパニオンオブジェクトのプロパティや関数にアクセスするには、クラス名を参照します。例:

```kotlin
class BigBen {
    companion object Bonger {
        fun getBongs(nTimes: Int) {
            repeat(nTimes) { print("BONG ") }
            }
        }
    }

fun main() {
    // クラスが最初に参照されたときにコンパニオンオブジェクトが作成されます。
    BigBen.getBongs(12)
    // BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG BONG 
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-companion-object"}

この例では、`BigBen`というクラスを作成し、その中に`Bonger`というコンパニオンオブジェクトが含まれています。コンパニオンオブジェクトには、整数を受け取り、その整数の回数だけコンソールに`"BONG"`を出力する`getBongs()`というメンバ関数があります。

`main()`関数では、クラス名を参照して`getBongs()`関数が呼び出されます。この時点でコンパニオンオブジェクトが作成されます。`getBongs()`関数はパラメータ`12`で呼び出されます。

詳細については、[](object-declarations.md#companion-objects)を参照してください。

## 練習

### 演習 1 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-1"}

あなたはコーヒーショップを経営しており、顧客の注文を追跡するシステムを持っています。以下のコードを検討し、`main()`関数内の次のコードが正常に実行されるように、2番目のデータオブジェクトの宣言を完成させてください。

|---|---|

```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object // Write your code here

fun main() {
    // 各データオブジェクトの名前を出力
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // 注文が同一であるかを確認
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-1"}

|---|---|
```kotlin
interface Order {
    val orderId: String
    val customerName: String
    val orderTotal: Double
}

data object OrderOne: Order {
    override val orderId = "001"
    override val customerName = "Alice"
    override val orderTotal = 15.50
}

data object OrderTwo: Order {
    override val orderId = "002"
    override val customerName = "Bob"
    override val orderTotal = 12.75
}

fun main() {
    // 各データオブジェクトの名前を出力
    println("Order name: $OrderOne")
    // Order name: OrderOne
    println("Order name: $OrderTwo")
    // Order name: OrderTwo

    // 注文が同一であるかを確認
    println("Are the two orders identical? ${OrderOne == OrderTwo}")
    // Are the two orders identical? false

    if (OrderOne == OrderTwo) {
        println("The orders are identical.")
    } else {
        println("The orders are unique.")
        // The orders are unique.
    }

    println("Do the orders have the same customer name? ${OrderOne.customerName == OrderTwo.customerName}")
    // Do the orders have the same customer name? false
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-objects-solution-1"}

### 演習 2 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-2"}

`Vehicle`インターフェースを継承するオブジェクト宣言を作成し、ユニークな車両タイプ`FlyingSkateboard`を作成してください。`main()`関数内の次のコードが正常に実行されるように、`name`プロパティと`move()`関数をオブジェクトに実装してください。

|---|---|

```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object // Write your code here

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-2"}

|---|---|
```kotlin
interface Vehicle {
    val name: String
    fun move(): String
}

object FlyingSkateboard : Vehicle {
    override val name = "Flying Skateboard"
    override fun move() = "Glides through the air with a hover engine"

   fun fly(): String = "Woooooooo"
}

fun main() {
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.move()}")
    // Flying Skateboard: Glides through the air with a hover engine
    println("${FlyingSkateboard.name}: ${FlyingSkateboard.fly()}")
    // Flying Skateboard: Woooooooo
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-objects-solution-2"}

### 演習 3 {initial-collapse-state="collapsed" collapsible="true" id="objects-exercise-3"}

温度を記録するアプリがあります。クラス自体は情報を摂氏で保存しますが、華氏でインスタンスを作成する簡単な方法も提供したいと考えています。`main()`関数内の次のコードが正常に実行されるように、データクラスを完成させてください。

<deflist collapsible="true">
    <def title="ヒント">
        コンパニオンオブジェクトを使用してください。
    </def>
</deflist>

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    // Write your code here
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 32.22222222222222°C is 90.0 °F
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-objects-exercise-3"}

|---|---|
```kotlin
data class Temperature(val celsius: Double) {
    val fahrenheit: Double = celsius * 9 / 5 + 32

    companion object {
        fun fromFahrenheit(fahrenheit: Double): Temperature = Temperature((fahrenheit - 32) * 5 / 9)
    }
}

fun main() {
    val fahrenheit = 90.0
    val temp = Temperature.fromFahrenheit(fahrenheit)
    println("${temp.celsius}°C is $fahrenheit °F")
    // 32.22222222222222°C is 90.0 °F
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-objects-solution-3"}

## 次のステップ

[中級: `open`クラスと特殊クラス](kotlin-tour-intermediate-open-special-classes.md)