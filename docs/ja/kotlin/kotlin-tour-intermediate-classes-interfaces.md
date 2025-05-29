[//]: # (title: 中級: クラスとインターフェース)

<no-index/>

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="First step" /> <a href="kotlin-tour-intermediate-extension-functions.md">拡張関数</a><br />
        <img src="icon-2-done.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">スコープ関数</a><br />
        <img src="icon-3-done.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">レシーバー付きラムダ式</a><br /> 
        <img src="icon-4.svg" width="20" alt="Fourth step" /> <strong>クラスとインターフェース</strong><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">オブジェクト</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">オープンクラスと特殊なクラス</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">プロパティ</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">ライブラリとAPI</a></p>
</tldr>

初級ツアーでは、コード内で共有できる特徴のコレクションをデータを保存し、維持するために、クラスとデータクラスを使用する方法を学びました。最終的には、プロジェクト内でコードを効率的に共有するために階層を作成したくなるでしょう。この章では、Kotlinがコード共有のために提供するオプションと、それらがコードをより安全で保守しやすくする方法について説明します。

## クラスの継承

前の章では、元のソースコードを変更せずにクラスを拡張するために拡張関数を使用する方法について説明しました。しかし、**クラス間**でコードを共有することが役立つような複雑なものを開発している場合はどうでしょうか？そのような場合、クラス継承を使用できます。

デフォルトでは、Kotlinのクラスは継承できません。Kotlinはこのように設計されており、意図しない継承を防ぎ、クラスを保守しやすくします。

Kotlinのクラスは**単一継承**のみをサポートしており、これは**一度に1つのクラス**からしか継承できないことを意味します。このクラスは**親**と呼ばれます。

クラスの親は別のクラス (祖先クラス) から継承し、階層を形成します。Kotlinのクラス階層の最上位には、共通の親クラスである `Any` があります。すべてのクラスは最終的に `Any` クラスから継承されます。

![Any型クラス階層の例](any-type-class.png){width="200"}

`Any` クラスは `toString()` 関数をメンバー関数として自動的に提供します。したがって、この継承された関数を任意のクラスで使用できます。例えば、

```kotlin
class Car(val make: String, val model: String, val numberOfDoors: Int)

fun main() {
    //sampleStart
    val car1 = Car("Toyota", "Corolla", 4)

    // Uses the .toString() function via string templates to print class properties
    println("Car1: make=${car1.make}, model=${car1.model}, numberOfDoors=${car1.numberOfDoors}")
    // Car1: make=Toyota, model=Corolla, numberOfDoors=4
    //sampleEnd
}
```
{kotlin-runnable="true" id="kotlin-tour-any-class"}

継承を使用してクラス間でコードを共有したい場合は、まず抽象クラスの使用を検討してください。

### 抽象クラス

抽象クラスはデフォルトで継承できます。抽象クラスの目的は、他のクラスが継承または実装するメンバーを提供することです。結果として、それらはコンストラクタを持ちますが、そこからインスタンスを作成することはできません。子クラス内で、`override` キーワードを使用して親のプロパティと関数の振る舞いを定義します。このようにして、子クラスが親クラスのメンバーを「オーバーライドする」と言うことができます。

> 継承された関数またはプロパティの振る舞いを定義する場合、それを**実装**と呼びます。
> 
{style="tip"}

抽象クラスには、実装**あり**の関数とプロパティ、および実装**なし**の関数とプロパティ (抽象関数と抽象プロパティとして知られる) の両方を含めることができます。

抽象クラスを作成するには、`abstract` キーワードを使用します。

```kotlin
abstract class Animal
```

実装**なし**の関数またはプロパティを宣言するには、同様に `abstract` キーワードを使用します。

```kotlin
abstract fun makeSound()
abstract val sound: String
```

例えば、異なる製品カテゴリを定義するために子クラスを作成できる `Product` という名前の抽象クラスを作成したいとします。

```kotlin
abstract class Product(val name: String, var price: Double) {
    // Abstract property for the product category
    abstract val category: String

    // A function that can be shared by all products
    fun productInfo(): String {
        return "Product: $name, Category: $category, Price: $price"
    }
}
```

抽象クラスでは、

* コンストラクタには、製品の `name` と `price` の2つのパラメータがあります。
* 製品カテゴリを文字列として含む抽象プロパティがあります。
* 製品に関する情報を出力する関数があります。

電子機器用の子クラスを作成しましょう。子クラスで `category` プロパティの実装を定義する前に、`override` キーワードを使用する必要があります。

```kotlin
class Electronic(name: String, price: Double, val warranty: Int) : Product(name, price) {
    override val category = "Electronic"
}
```

`Electronic` クラスは、

* `Product` 抽象クラスを継承します。
* コンストラクタに追加のパラメータ `warranty` があります。これは電子機器に固有のものです。
* `category` プロパティをオーバーライドして文字列 `"Electronic"` を含むようにします。

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
    // Creates an instance of the Electronic class
    val laptop = Electronic(name = "Laptop", price = 1000.0, warranty = 2)

    println(laptop.productInfo())
    // Product: Laptop, Category: Electronic, Price: 1000.0
}
//sampleEnd
```
{kotlin-runnable="true" id="kotlin-tour-abstract-class"}

抽象クラスはこのようにコードを共有するのに非常に役立ちますが、Kotlinのクラスは単一継承のみをサポートしているため、制限があります。複数のソースから継承する必要がある場合は、インターフェースの使用を検討してください。

## インターフェース

インターフェースはクラスに似ていますが、いくつかの違いがあります。

* インターフェースのインスタンスを作成することはできません。それらにはコンストラクタやヘッダーがありません。
* それらの関数とプロパティは、デフォルトで暗黙的に継承可能です。Kotlinでは、これらを「オープン (open)」と呼びます。
* 実装を与えない場合、関数を `abstract` とマークする必要はありません。

抽象クラスと同様に、インターフェースを使用して、クラスが後で継承および実装できる関数とプロパティのセットを定義します。このアプローチは、特定の実装詳細ではなく、インターフェースによって記述される抽象化に焦点を当てるのに役立ちます。インターフェースを使用すると、コードは次のようになります。

* さまざまな部分を分離し、独立して進化させることができるため、よりモジュール化されます。
* 関連する関数を一貫したセットにグループ化することで、理解しやすくなります。
* テストのために実装をモックと素早く入れ替えることができるため、テストしやすくなります。

インターフェースを宣言するには、`interface` キーワードを使用します。

```kotlin
interface PaymentMethod
```

### インターフェースの実装

インターフェースは多重継承をサポートしているため、クラスは一度に複数のインターフェースを実装できます。まず、クラスが**1つ**のインターフェースを実装するシナリオを考えてみましょう。

インターフェースを実装するクラスを作成するには、クラスヘッダーの後にコロンを追加し、その後に実装したいインターフェース名を追加します。インターフェースにはコンストラクタがないため、インターフェース名の後に括弧 `()` を使用しません。

```kotlin
class CreditCardPayment : PaymentMethod
```

例えば:

```kotlin
interface PaymentMethod {
    // Functions are inheritable by default
    fun initiatePayment(amount: Double): String
}

class CreditCardPayment(val cardNumber: String, val cardHolderName: String, val expiryDate: String) : PaymentMethod {
    override fun initiatePayment(amount: Double): String {
        // Simulate processing payment with credit card
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

この例では、

* `PaymentMethod` は、実装を持たない `initiatePayment()` 関数を持つインターフェースです。
* `CreditCardPayment` は、`PaymentMethod` インターフェースを実装するクラスです。
* `CreditCardPayment` クラスは、継承された `initiatePayment()` 関数をオーバーライドします。
* `paymentMethod` は `CreditCardPayment` クラスのインスタンスです。
* オーバーライドされた `initiatePayment()` 関数が、`paymentMethod` インスタンスでパラメータ `100.0` とともに呼び出されます。

**複数の**インターフェースを実装するクラスを作成するには、クラスヘッダーの後にコロンを追加し、その後に実装したいインターフェース名をコンマで区切って追加します。

```kotlin
class CreditCardPayment : PaymentMethod, PaymentType
```

例えば:

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
        // Simulate processing payment with credit card
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

この例では、

* `PaymentMethod` は、実装を持たない `initiatePayment()` 関数を持つインターフェースです。
* `PaymentType` は、初期化されていない `paymentType` プロパティを持つインターフェースです。
* `CreditCardPayment` は、`PaymentMethod` インターフェースと `PaymentType` インターフェースを実装するクラスです。
* `CreditCardPayment` クラスは、継承された `initiatePayment()` 関数と `paymentType` プロパティをオーバーライドします。
* `paymentMethod` は `CreditCardPayment` クラスのインスタンスです。
* オーバーライドされた `initiatePayment()` 関数が、`paymentMethod` インスタンスでパラメータ `100.0` とともに呼び出されます。
* オーバーライドされた `paymentType` プロパティが、`paymentMethod` インスタンスでアクセスされます。

インターフェースとインターフェース継承の詳細については、[インターフェース](interfaces.md)を参照してください。

## デリゲーション

インターフェースは便利ですが、インターフェースに多くの関数が含まれている場合、子クラスは多くのボイラープレートコードを記述することになる可能性があります。親の振る舞いのごく一部だけをオーバーライドしたい場合でも、多くの繰り返しが必要になります。

> ボイラープレートコードとは、ソフトウェアプロジェクトの複数の部分で、ほとんどまたはまったく変更せずに再利用されるコードの塊のことです。
> 
{style="tip"}

例えば、多数の関数と `color` という名前のプロパティを1つ含む `Drawable` という名前のインターフェースがあるとします。

```kotlin
interface Drawable {
    fun draw()
    fun resize()
    val color: String?
}
```

`Drawable` インターフェースを実装し、そのすべてのメンバーに実装を提供する `Circle` という名前のクラスを作成します。

```kotlin
class Circle : Drawable {
    override fun draw() {
        TODO("An example implementation")
    }
    
    override fun resize() {
        TODO("An example implementation")
    }
   override val color = null
}
```

`color` プロパティの値**以外**は同じ振る舞いをする `Circle` クラスの子クラスを作成したい場合でも、`Circle` クラスの各メンバー関数の実装を追加する必要があります。

```kotlin
class RedCircle(val circle: Circle) : Circle {

    // Start of boilerplate code
    override fun draw() {
        circle.draw()
    }

    override fun resize() {
        circle.resize()
    }

    // End of boilerplate code
    override val color = "red"
}
```

`Drawable` インターフェースに多数のメンバー関数がある場合、`RedCircle` クラスのボイラープレートコードの量が非常に大きくなる可能性があることがわかります。しかし、代替手段があります。

Kotlinでは、デリゲーションを使用して、インターフェースの実装をクラスのインスタンスに委譲できます。例えば、`Circle` クラスのインスタンスを作成し、`Circle` クラスのメンバー関数の実装をこのインスタンスに委譲できます。これを行うには、`by` キーワードを使用します。例えば、

```kotlin
class RedCircle(param: Circle) : Drawable by param
```

ここで、`param` は、メンバー関数の実装が委譲される `Circle` クラスのインスタンスの名前です。

これで、`RedCircle` クラスにメンバー関数の実装を追加する必要がなくなりました。コンパイラが `Circle` クラスから自動的にこれを行います。これにより、多くのボイラープレートコードを書く手間が省けます。その代わりに、子クラスで変更したい振る舞いに対してのみコードを追加します。

例えば、`color` プロパティの値を変更したい場合:

```kotlin
class RedCircle(param : Circle) : Drawable by param {
    // No boilerplate code!
    override val color = "red"
}
```

必要であれば、`RedCircle` クラスで継承されたメンバー関数の振る舞いをオーバーライドすることもできますが、すべての継承されたメンバー関数に対して新しいコード行を追加する必要はなくなります。

詳細については、[デリゲーション](delegation.md)を参照してください。

## 練習問題

### 演習1 {initial-collapse-state="collapsed" collapsible="true" id="classes-interfaces-exercise-1"}

スマートホームシステムを開発していると想像してください。スマートホームには通常、いくつかの基本的な機能と固有の振る舞いを両方持つ異なる種類のデバイスがあります。以下のコードサンプルで、子クラス `SmartLight` が正常にコンパイルされるように、`SmartDevice` という名前の `abstract` クラスを完成させてください。

次に、`SmartDevice` クラスを継承し、どのサーモスタットが加熱中またはオフになったかを説明する出力ステートメントを返す `turnOn()` および `turnOff()` 関数を実装する `SmartThermostat` という名前の別の子クラスを作成します。最後に、温度の測定値を入力として受け取り、`$name thermostat set to $temperature°C.` と出力する `adjustTemperature()` という名前の別の関数を追加します。

<deflist collapsible="true">
    <def title="ヒント">
        <code>SmartDevice</code> クラスに、<code>turnOn()</code> と <code>turnOff()</code> 関数を追加し、後で <code>SmartThermostat</code> クラスでそれらの振る舞いをオーバーライドできるようにします。
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

`Audio`、`Video`、`Podcast` などの特定のメディアクラスを実装するために使用できる `Media` という名前のインターフェースを作成します。インターフェースには以下を含める必要があります。

* メディアのタイトルを表す `title` という名前のプロパティ。
* メディアを再生する `play()` という名前の関数。

次に、`Media` インターフェースを実装する `Audio` という名前のクラスを作成します。`Audio` クラスは、コンストラクタで `title` プロパティを使用し、さらに `String` 型の `composer` という名前の追加プロパティを持つ必要があります。クラス内で、`play()` 関数を実装して次の内容を出力するようにします: `"Playing audio: $title, composed by $composer"`。

<deflist collapsible="true">
    <def title="ヒント">
        クラスヘッダーで <code>override</code> キーワードを使用すると、コンストラクタでインターフェースのプロパティを実装できます。
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

eコマースアプリケーション用の決済処理システムを構築しています。各決済方法は、支払いを承認し、取引を処理できる必要があります。一部の支払いでは払い戻しを処理できる必要もあります。

1. `Refundable` インターフェースに、払い戻しを処理するための `refund()` という名前の関数を追加します。

2. `PaymentMethod` 抽象クラスに以下を追加します。
   * `amount` を受け取り、その量を含むメッセージを出力する `authorize()` という名前の関数を追加します。
   * 同様に `amount` を受け取る `processPayment()` という名前の抽象関数を追加します。

3. `Refundable` インターフェースと `PaymentMethod` 抽象クラスを実装する `CreditCard` という名前のクラスを作成します。このクラスで、`refund()` 関数と `processPayment()` 関数の実装を追加し、次のステートメントを出力するようにします。
   * `"Refunding $amount to the credit card."`
   * `"Processing credit card payment of $amount."`

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

基本的な機能を持つシンプルなメッセージングアプリがありますが、コードを大幅に重複させることなく _スマート_ メッセージの機能を追加したいと考えています。

以下のコードで、`BasicMessenger` クラスを継承しつつ、その実装を `BasicMessenger` クラスのインスタンスに委譲する `SmartMessenger` という名前のクラスを定義してください。

`SmartMessenger` クラスで、`sendMessage()` 関数をオーバーライドしてスマートメッセージを送信するようにします。この関数は `message` を入力として受け取り、`"Sending a smart message: $message"` という出力ステートメントを返す必要があります。さらに、`BasicMessenger` クラスの `sendMessage()` 関数を呼び出し、メッセージに `[smart]` をプレフィックスとして付加してください。

> <code>SmartMessenger</code> クラスで <code>receiveMessage()</code> 関数を書き直す必要はありません。
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