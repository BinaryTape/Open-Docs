[//]: # (title: 中級: クラスとインターフェース)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバー付きラムダ式</a><br /> 
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>クラスとインターフェース</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">openと特殊なクラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

初級ツアーでは、コード内で共有できる特性のコレクションを維持し、データを保存するためにクラスとデータクラスを使用する方法を学びました。最終的には、プロジェクト内でコードを効率的に共有するための階層を作成したくなるでしょう。この章では、Kotlinがコード共有のために提供するオプションと、それがコードをより安全で保守しやすくする方法について説明します。

## クラスの継承

前の章では、元のソースコードを変更せずにクラスを拡張するために拡張関数を使用する方法を学びました。しかし、クラス**間**でコードを共有することが有用な複雑な作業に取り組んでいる場合はどうでしょうか？そのような場合、クラスの継承を使用できます。

デフォルトでは、Kotlinのクラスは継承できません。Kotlinはこのように設計されており、意図しない継承を防ぎ、クラスの保守を容易にします。

Kotlinのクラスは**単一継承**のみをサポートしており、これは**一度に1つのクラス**からしか継承できないことを意味します。このクラスは**親クラス**と呼ばれます。

クラスの親クラスは別のクラス（祖父母クラス）から継承し、階層を形成します。Kotlinのクラス階層の最上位にあるのは、共通の親クラスである`Any`です。すべてのクラスは最終的に`Any`クラスから継承します。

![Any型のクラス階層の例](any-type-class.png){width="200"}

`Any`クラスは、`toString()`関数を自動的にメンバ関数として提供します。したがって、この継承された関数をどのクラスでも使用できます。例：

```kotlin
class Car(val make: String, val model: String, val numberOfDoors: Int)

fun main() {
    //sampleStart
    val car1 = Car("Toyota", "Corolla", 4)

    // 文字列テンプレートを介して.toString()関数を使用し、クラスプロパティを出力
    println("Car1: make=${car1.make}, model=${car1.model}, numberOfDoors=${car1.numberOfDoors}")
    // Car1: make=Toyota, model=Corolla, numberOfDoors=4
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-any-class"}

クラス間でコードを共有するために継承を使用したい場合は、まず抽象クラスの使用を検討してください。

### 抽象クラス

抽象クラスはデフォルトで継承可能です。抽象クラスの目的は、他のクラスが継承または実装するメンバを提供することです。結果として、それらはコンストラクタを持ちますが、インスタンスを作成することはできません。子クラス内で、`override`キーワードを使用して親のプロパティと関数の動作を定義します。このようにして、子クラスが親クラスのメンバを「オーバーライド」すると言えます。

> 継承された関数やプロパティの動作を定義することを、**実装**と呼びます。
> 
{style="tip"}

抽象クラスには、実装**あり**の関数とプロパティ、および実装**なし**の関数とプロパティ（抽象関数とプロパティとして知られています）の両方を含めることができます。

抽象クラスを作成するには、`abstract`キーワードを使用します。

```kotlin
abstract class Animal
```

実装**なし**の関数またはプロパティを宣言するには、`abstract`キーワードも使用します。

```kotlin
abstract fun makeSound()
abstract val sound: String
```

例えば、異なる製品カテゴリを定義するために子クラスを作成できる`Product`という抽象クラスを作成したいとします。

```kotlin
abstract class Product(val name: String, var price: Double) {
    // 製品カテゴリのための抽象プロパティ
    abstract val category: String

    // すべての製品で共有できる関数
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}
```

抽象クラスでは：

*   コンストラクタは製品の`name`と`price`の2つのパラメータを持ちます。
*   製品カテゴリを文字列として含む抽象プロパティがあります。
*   製品に関する情報を出力する関数があります。

電子機器用のチャイルドクラスを作成しましょう。チャイルドクラスで`category`プロパティの実装を定義する前に、`override`キーワードを使用する必要があります。

```kotlin
class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}
```

`Electronic`クラス：

*   `Product`抽象クラスを継承します。
*   コンストラクタに追加のパラメータ`warranty`を持ち、これは電子機器に固有のものです。
*   `category`プロパティをオーバーライドして、文字列`"Electronic"`を含めます。

これで、これらのクラスを次のように使用できます。

```kotlin
abstract class Product(val name: String, var price: Double) {
    // Abstract property for the product category
    abstract val category: String

    // A function that can be shared by all products
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}

class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}

//sampleStart
fun main() {
    // Electronicクラスのインスタンスを作成します
    val laptop = Electronic(name = "Laptop", price = 1000.0, warranty = 2)

    println(laptop.productInfo())
    // Product: Laptop, Category: Electronic, Price: 1000.0
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-abstract-class"}

このようにコードを共有するのに抽象クラスは優れていますが、Kotlinのクラスは単一継承のみをサポートしているため制限があります。複数のソースから継承する必要がある場合は、インターフェースの使用を検討してください。

## インターフェース

インターフェースはクラスに似ていますが、いくつかの違いがあります。

*   インターフェースのインスタンスを作成することはできません。それらはコンストラクタやヘッダを持ちません。
*   それらの関数とプロパティはデフォルトで暗黙的に継承可能です。Kotlinでは、それらを「open」と呼びます。
*   実装を与えない場合、それらの関数を`abstract`としてマークする必要はありません。

抽象クラスと同様に、インターフェースを使用して、クラスが後で継承および実装できる一連の関数とプロパティを定義します。このアプローチは、具体的な実装の詳細ではなく、インターフェースによって記述された抽象化に焦点を当てるのに役立ちます。インターフェースを使用すると、コードが次のように改善されます。

*   異なる部分を分離し、独立して進化できるようにすることで、よりモジュール化されます。
*   関連する関数をまとまりのあるセットにグループ化することで、理解しやすくなります。
*   テストのために実装をモックと素早く交換できるため、テストが容易になります。

インターフェースを宣言するには、`interface`キーワードを使用します。

```kotlin
interface PaymentMethod
```

### インターフェースの実装

インターフェースは多重継承をサポートしているため、1つのクラスで複数のインターフェースを一度に実装できます。まず、クラスが**1つ**のインターフェースを実装するシナリオを考えてみましょう。

インターフェースを実装するクラスを作成するには、クラスヘッダーの後にコロンを追加し、続けて実装したいインターフェース名を記述します。インターフェースにはコンストラクタがないため、インターフェース名の後に括弧`()`は使用しません。

```kotlin
class CreditCardPayment : PaymentMethod
```

例：

```kotlin
interface PaymentMethod {
    // 関数はデフォルトで継承可能です
    fun initiatePayment(amount: Double): String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod {
    override fun initiatePayment(amount: Double): String {
        // クレジットカードでの支払い処理をシミュレート
        return "Payment of $amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-inheritance"}

この例では：

*   `PaymentMethod`は、実装を持たない`initiatePayment()`関数を持つインターフェースです。
*   `CreditCardPayment`は、`PaymentMethod`インターフェースを実装するクラスです。
*   `CreditCardPayment`クラスは、継承された`initiatePayment()`関数をオーバーライドします。
*   `paymentMethod`は`CreditCardPayment`クラスのインスタンスです。
*   オーバーライドされた`initiatePayment()`関数は、`paymentMethod`インスタンス上で`100.0`のパラメータと共に呼び出されます。

**複数の**インターフェースを実装するクラスを作成するには、クラスヘッダーの後にコロンを追加し、続けて実装したいインターフェース名をカンマで区切って記述します。

```kotlin
class CreditCardPayment : PaymentMethod, PaymentType
```

例：

```kotlin
interface PaymentMethod {
    fun initiatePayment(amount: Double): String
}

interface PaymentType {
    val paymentType: String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod,
    PaymentType {
    override fun initiatePayment(amount: Double): String {
        // クレジットカードでの支払い処理をシミュレート
        return "Payment of $amount initiated using Credit Card ending in ${cardNumber.takeLast(4)}."
    }

    override val paymentType: String = "Credit Card"
}

fun main() {
    val paymentMethod = CreditCardPayment("1234 5678 9012 3456", "John Doe", "12/25")
    println(paymentMethod.initiatePayment(100.0))
    // Payment of $100.0 initiated using Credit Card ending in 3456.

    println("Payment is by ${paymentMethod.paymentType}")
    // Payment is by Credit Card
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-multiple-inheritance"}

この例では：

*   `PaymentMethod`は、実装を持たない`initiatePayment()`関数を持つインターフェースです。
*   `PaymentType`は、初期化されていない`paymentType`プロパティを持つインターフェースです。
*   `CreditCardPayment`は、`PaymentMethod`と`PaymentType`インターフェースを実装するクラスです。
*   `CreditCardPayment`クラスは、継承された`initiatePayment()`関数と`paymentType`プロパティをオーバーライドします。
*   `paymentMethod`は`CreditCardPayment`クラスのインスタンスです。
*   オーバーライドされた`initiatePayment()`関数は、`paymentMethod`インスタンス上で`100.0`のパラメータと共に呼び出されます。
*   オーバーライドされた`paymentType`プロパティは、`paymentMethod`インスタンス上でアクセスされます。

インターフェースとインターフェースの継承に関する詳細については、[インターフェース](interfaces.md)を参照してください。

## デリゲーション

インターフェースは便利ですが、インターフェースに多くの関数が含まれている場合、子クラスは大量のボイラープレートコードで終わる可能性があります。親の動作の小さな部分だけをオーバーライドしたい場合、多くの繰り返しが必要になります。

> ボイラープレートコードとは、ソフトウェアプロジェクトの複数の部分で、ほとんどまたはまったく変更を加えることなく再利用されるコードの塊のことです。
> 
{style="tip"}

例えば、`DrawingTool`というインターフェースがあり、多数の関数と`color`という1つのプロパティが含まれているとします。

```kotlin
interface DrawingTool {
    val color: String
    fun draw(shape: String)
    fun erase(area: String)
    fun getToolInfo(): String
}
```

`DrawingTool`インターフェースを実装し、そのすべてのメンバの実装を提供する`PenTool`というクラスを作成します。

```kotlin
class PenTool : DrawingTool {
    override val color: String = "black"

    override fun draw(shape: String) {
        println("Drawing $shape using a pen in $color")
    }

    override fun erase(area: String) {
        println("Erasing $area with pen tool")
    }

    override fun getToolInfo(): String {
        return "PenTool(color=$color)"
    }
}
```

`PenTool`クラスと同じ動作をするが、`color`プロパティの値が異なるクラスを作成したいとします。1つのアプローチは、`DrawingTool`インターフェースを実装するオブジェクトをパラメータとして受け取る新しいクラス（`PenTool`クラスのインスタンスのように）を作成することです。次に、そのクラス内で`color`プロパティをオーバーライドできます。

しかし、このシナリオでは、`DrawingTool`インターフェースの各メンバに実装を追加する必要があります。

```kotlin
interface DrawingTool {
    val color: String
    fun draw(shape: String)
    fun erase(area: String)
    fun getToolInfo(): String
}

class PenTool : DrawingTool {
    override val color: String = "black"

    override fun draw(shape: String) {
        println("Drawing $shape using a pen in $color")
    }

    override fun erase(area: String) {
        println("Erasing $area with pen tool")
    }

    override fun getToolInfo(): String {
        return "PenTool(color=$color)"
    }
}
//sampleStart
class CanvasSession(val tool: DrawingTool) : DrawingTool {
    override val color: String = "blue"

    override fun draw(shape: String) {
        tool.draw(shape)
    }

    override fun erase(area: String) {
        tool.erase(area)
    }

    override fun getToolInfo(): String {
        return tool.getToolInfo()
    }
}
//sampleEnd
fun main() {
    val pen = PenTool()
    val session = CanvasSession(pen)

    println("Pen color: ${pen.color}")
    // Pen color: black

    println("Session color: ${session.color}")
    // Session color: blue

    session.draw("circle")
    // Drawing circle with pen in black

    session.erase("top-left corner")
    // Erasing top-left corner with pen tool

    println(session.getToolInfo())
    // PenTool(color=black)
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-non-delegation"}

`DrawingTool`インターフェースに多数のメンバ関数がある場合、`CanvasSession`クラスのボイラープレートコードの量が非常に大きくなることがわかります。しかし、代替手段があります。

Kotlinでは、デリゲーションを使用して、インターフェースの実装をクラスのインスタンスに委譲できます。例えば：

```kotlin
class CanvasSession(val tool: DrawingTool) : DrawingTool by tool
```

ここで、`tool`は、メンバ関数の実装が委譲される`PenTool`クラスのインスタンス名です。

これで、`CanvasSession`クラスのメンバ関数に実装を追加する必要がなくなりました。コンパイラが`PenTool`クラスから自動的にこれを行います。これにより、多くのボイラープレートコードを書く手間が省けます。代わりに、子クラスで変更したい動作のためだけにコードを追加します。

例えば、`color`プロパティの値を変更したい場合：

```kotlin
interface DrawingTool {
    val color: String
    fun draw(shape: String)
    fun erase(area: String)
    fun getToolInfo(): String
}

class PenTool : DrawingTool {
    override val color: String = "black"

    override fun draw(shape: String) {
        println("Drawing $shape using a pen in $color")
    }

    override fun erase(area: String) {
        println("Erasing $area with pen tool")
    }

    override fun getToolInfo(): String {
        return "PenTool(color=$color)"
    }
}

//sampleStart
class CanvasSession(val tool: DrawingTool) : DrawingTool by tool {
    // ボイラープレートコードなし！
    override val color: String = "blue"
}
//sampleEnd
fun main() {
    val pen = PenTool()
    val session = CanvasSession(pen)

    println("Pen color: ${pen.color}")
    // Pen color: black

    println("Session color: ${session.color}")
    // Session color: blue

    session.draw("circle")
    // Drawing circle with pen in black

    session.erase("top-left corner")
    // Erasing top-left corner with pen tool

    println(session.getToolInfo())
    // PenTool(color=black)
}
```
{kotlin-runnable="true" id="kotlin-tour-interface-delegation"}

必要であれば、`CanvasSession`クラスで継承されたメンバ関数の動作をオーバーライドすることもできますが、これで継承されたメンバ関数ごとに新しいコード行を追加する必要がなくなります。

詳細については、[デリゲーション](delegation.md)を参照してください。

## 演習

### 演習1 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-1"}

スマートホームシステムに取り組んでいると想像してください。スマートホームには通常、基本的な機能を持つものの、独自の動作も持つ様々な種類のデバイスがあります。以下のコードサンプルで、子クラス`SmartLight`が正常にコンパイルされるように、`SmartDevice`という`abstract`クラスを完成させてください。

次に、`SmartDevice`クラスを継承し、どのサーモスタットが加熱中または電源オフになっているかを説明する出力ステートメントを返す`turnOn()`および`turnOff()`関数を実装する`SmartThermostat`という別のチャイルドクラスを作成してください。最後に、温度測定値を入力として受け取り、`$name thermostat set to $temperature°C.`と出力する`adjustTemperature()`という別の関数を追加してください。

<deflist collapsible="true">
    <def title="ヒント">
        <code>SmartDevice</code>クラスに、<code>SmartThermostat</code>クラスで後で動作をオーバーライドできるように、<code>turnOn()</code>と<code>turnOff()</code>関数を追加してください。
    </def>
</deflist>

|--|--|

```kotlin
abstract class // Write your code here

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat // Write your code here

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    
    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-1"}

|---|---|
```kotlin
abstract class SmartDevice(val name: String) {
    abstract fun turnOn()
    abstract fun turnOff()
}

class SmartLight(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name is now ON.")
    }

    override fun turnOff() {
        println("$name is now OFF.")
    }

   fun adjustBrightness(level: Int) {
        println("Adjusting $name brightness to $level%.")
    }
}

class SmartThermostat(name: String) : SmartDevice(name) {
    override fun turnOn() {
        println("$name thermostat is now heating.")
    }

    override fun turnOff() {
        println("$name thermostat is now off.")
    }

   fun adjustTemperature(temperature: Int) {
        println("$name thermostat set to $temperature°C.")
    }
}

fun main() {
    val livingRoomLight = SmartLight("Living Room Light")
    val bedroomThermostat = SmartThermostat("Bedroom Thermostat")
    
    livingRoomLight.turnOn()
    // Living Room Light is now ON.
    livingRoomLight.adjustBrightness(10)
    // Adjusting Living Room Light brightness to 10%.
    livingRoomLight.turnOff()
    // Living Room Light is now OFF.

    bedroomThermostat.turnOn()
    // Bedroom Thermostat thermostat is now heating.
    bedroomThermostat.adjustTemperature(5)
    // Bedroom Thermostat thermostat set to 5°C.
    bedroomThermostat.turnOff()
    // Bedroom Thermostat thermostat is now off.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-classes-interfaces-solution-1"}

### 演習2 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-2"}

`Audio`、`Video`、`Podcast`などの特定のメディアクラスを実装するために使用できる`Media`というインターフェースを作成してください。このインターフェースには、以下を含める必要があります。

*   メディアのタイトルを表す`title`というプロパティ。
*   メディアを再生する`play()`という関数。

次に、`Media`インターフェースを実装する`Audio`というクラスを作成してください。`Audio`クラスは、コンストラクタで`title`プロパティを使用し、さらに`String`型の`composer`という追加のプロパティを持つ必要があります。このクラスで、`play()`関数を実装して、次の内容を出力するようにしてください: `"Playing audio: $title, composed by $composer"`。

<deflist collapsible="true">
    <def title="ヒント">
        クラスのヘッダーで<code>override</code>キーワードを使用して、インターフェースのプロパティをコンストラクタで実装できます。
    </def>
</deflist>

|---|---|
```kotlin
interface // Write your code here

class // Write your code here

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-2"}

|---|---|
```kotlin
interface Media {
    val title: String
    fun play()
}

class Audio(override val title: String, val composer: String) : Media {
    override fun play() {
        println("Playing audio: $title, composed by $composer")
    }
}

fun main() {
    val audio = Audio("Symphony No. 5", "Beethoven")
    audio.play()
   // Playing audio: Symphony No. 5, composed by Beethoven
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-classes-interfaces-solution-2"}

### 演習3 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-3"}

Eコマースアプリケーションの決済処理システムを構築しています。各支払い方法には、支払いを承認し、取引を処理する機能が必要です。一部の支払いでは、払い戻しを処理する機能も必要です。

1.  `Refundable`インターフェースに、払い戻しを処理するための`refund()`という関数を追加してください。

2.  `PaymentMethod`抽象クラスに：
    *   金額を受け取り、その金額を含むメッセージを出力する`authorize()`という関数を追加してください。
    *   同じく金額を受け取る抽象関数`processPayment()`を追加してください。

3.  `Refundable`インターフェースと`PaymentMethod`抽象クラスを実装する`CreditCard`というクラスを作成してください。このクラスで、`refund()`関数と`processPayment()`関数の実装を追加し、次のステートメントを出力するようにしてください。
    *   `"Refunding $amount to the credit card."`
    *   `"Processing credit card payment of $amount."`

|---|---|
```kotlin
interface Refundable {
    // Write your code here
}

abstract class PaymentMethod(val name: String) {
    // Write your code here
}

class CreditCard // Write your code here

fun main() {
    val visa = CreditCard("Visa")
    
    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-3"}

|---|---|
```kotlin
interface Refundable {
    fun refund(amount: Double)
}

abstract class PaymentMethod(val name: String) {
    fun authorize(amount: Double) {
        println("Authorizing payment of $amount.")
    }

    abstract fun processPayment(amount: Double)
}

class CreditCard(name: String) : PaymentMethod(name), Refundable {
    override fun processPayment(amount: Double) {
        println("Processing credit card payment of $amount.")
    }

    override fun refund(amount: Double) {
        println("Refunding $amount to the credit card.")
    }
}

fun main() {
    val visa = CreditCard("Visa")
    
    visa.authorize(100.0)
    // Authorizing payment of $100.0.
    visa.processPayment(100.0)
    // Processing credit card payment of $100.0.
    visa.refund(50.0)
    // Refunding $50.0 to the credit card.
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-classes-interfaces-solution-3"}

### 演習4 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-4"}

基本的な機能を持つシンプルなメッセージングアプリがありますが、コードを大幅に重複させることなく、_スマート_メッセージの機能を追加したいと考えています。

以下のコードで、`Messenger`インターフェースを継承し、実装を`BasicMessenger`クラスのインスタンスにデリゲートする`SmartMessenger`というクラスを定義してください。

`SmartMessenger`クラスで、スマートメッセージを送信するために`sendMessage()`関数をオーバーライドしてください。この関数は`message`を入力として受け取り、`"Sending a smart message: $message"`という出力ステートメントを返す必要があります。さらに、`BasicMessenger`クラスから`sendMessage()`関数を呼び出し、メッセージに`[smart]`をプレフィックスとして付けてください。

> `SmartMessenger`クラスで`receiveMessage()`関数を書き直す必要はありません。
> 
{style="note"}

|--|--|

```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger // Write your code here

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    
    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-interfaces-exercise-4"}

|---|---|
```kotlin
interface Messenger {
    fun sendMessage(message: String)
    fun receiveMessage(): String
}

class BasicMessenger : Messenger {
    override fun sendMessage(message: String) {
        println("Sending message: $message")
    }

    override fun receiveMessage(): String {
        return "You've got a new message!"
    }
}

class SmartMessenger(val basicMessenger: BasicMessenger) : Messenger by basicMessenger {
    override fun sendMessage(message: String) {
        println("Sending a smart message: $message")
        basicMessenger.sendMessage("[smart] $message")
    }
}

fun main() {
    val basicMessenger = BasicMessenger()
    val smartMessenger = SmartMessenger(basicMessenger)
    
    basicMessenger.sendMessage("Hello!")
    // Sending message: Hello!
    println(smartMessenger.receiveMessage())
    // You've got a new message!
    smartMessenger.sendMessage("Hello from SmartMessenger!")
    // Sending a smart message: Hello from SmartMessenger!
    // Sending message: [smart] Hello from SmartMessenger!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="解答例" id="kotlin-tour-classes-interfaces-solution-4"}

## 次のステップ

[中級: オブジェクト](kotlin-tour-intermediate-objects.md)