[//]: # (title: 継承)

Kotlinのすべてのクラスは共通のスーパータイプである`Any`を持ちます。これは、スーパークラスが明示的に宣言されていないクラスのデフォルトのスーパータイプです。

```kotlin
class Example // Implicitly inherits from Any
```

`Any`には`equals()`、`hashCode()`、`toString()`の3つのメソッドがあります。したがって、これらのメソッドはすべてのKotlinクラスで定義されています。

デフォルトでは、Kotlinのクラスは`final`です。つまり、継承できません。クラスを継承可能にするには、`open`キーワードでマークします。

```kotlin
open class Base // Class is open for inheritance

```

詳細については、[Openキーワード](#open-keyword)を参照してください。

明示的なスーパークラスを宣言するには、クラスヘッダーのコロンの後に型を配置します。

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

派生クラスがプライマリコンストラクタを持つ場合、基底クラスはそのプライマリコンストラクタ内で、そのパラメータに従って初期化できます（そして初期化する必要があります）。

派生クラスがプライマリコンストラクタを持たない場合、各セカンダリコンストラクタは`super`キーワードを使用して基底クラスを初期化するか、初期化を行う別のコンストラクタに処理を委譲する必要があります。この場合、異なるセカンダリコンストラクタが基底クラスの異なるコンストラクタを呼び出すことができる点に注意してください。

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## Openキーワード

Kotlinでは、`open`キーワードは、クラスまたはメンバー（関数やプロパティ）がサブクラスでオーバーライド可能であることを示します。デフォルトでは、Kotlinのクラスとそのメンバーは_final_であり、明示的に`open`とマークしない限り、継承（クラスの場合）またはオーバーライド（メンバーの場合）できません。

```kotlin
// 継承を許可するopenキーワードを持つ基底クラス
open class Person(
    val name: String
) {
    // サブクラスでオーバーライド可能なopen関数
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// Personを継承し、introduce()関数をオーバーライドするサブクラス
class Student(
    name: String,
    val school: String
) : Person(name) {
    override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

基底クラスのメンバーをオーバーライドする場合、オーバーライドするメンバーもデフォルトでは`open`です。この動作を変更し、クラスのサブクラスがあなたの実装をオーバーライドすることを禁止したい場合は、オーバーライドするメンバーを明示的に`final`とマークできます。

```kotlin
// 継承を許可するopenキーワードを持つ基底クラス
open class Person(val name: String) {
    // サブクラスでオーバーライド可能なopen関数
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// Personを継承し、introduce()関数をオーバーライドするサブクラス
class Student(name: String, val school: String) : Person(name) {
    // finalキーワードは、サブクラスでのさらなるオーバーライドを防ぎます
    final override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

## メソッドのオーバーライド

Kotlinでは、オーバーライド可能なメンバーとオーバーライドに対して明示的な修飾子が必要です。

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()`には`override`修飾子が必要です。これが欠落している場合、コンパイラはエラーを報告します。`Shape.fill()`のように関数に`open`修飾子がない場合、サブクラスで同じシグネチャを持つメソッドを宣言することは、`override`があってもなくても許可されません。`open`修飾子のないクラスである`final`クラスのメンバーに追加されても、`open`修飾子は何の効果もありません。

`override`とマークされたメンバーはそれ自体が`open`であるため、サブクラスでオーバーライドできます。再オーバーライドを禁止したい場合は、`final`を使用します。

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## プロパティのオーバーライド

オーバーライドのメカニズムは、メソッドと同様にプロパティにも適用されます。スーパークラスで宣言され、派生クラスで再宣言されるプロパティは、`override`で修飾される必要があり、互換性のある型でなければなりません。宣言された各プロパティは、初期化子を持つプロパティ、または`get`メソッドを持つプロパティによってオーバーライドできます。

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

`val`プロパティを`var`プロパティでオーバーライドすることはできますが、その逆はできません。これは、`val`プロパティが本質的に`get`メソッドを宣言し、それを`var`としてオーバーライドすることで、派生クラスに追加で`set`メソッドを宣言するため、許可されています。

プライマリコンストラクタのプロパティ宣言の一部として`override`キーワードを使用できる点に注意してください。

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // Always has 4 vertices

class Polygon : Shape {
    override var vertexCount: Int = 0  // Can be set to any number later
}
```

## 派生クラスの初期化順序

派生クラスの新しいインスタンスを構築する際、基底クラスの初期化が最初のステップとして実行されます（基底クラスコンストラクタの引数評価のみが先行します）。これは、派生クラスの初期化ロジックが実行される前に基底クラスの初期化が行われることを意味します。

```kotlin
//sampleStart
open class Base(val name: String) {

    init { println("Initializing a base class") }

    open val size: Int = 
        name.length.also { println("Initializing size in the base class: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.replaceFirstChar { it.uppercase() }.also { println("Argument for the base class: $it") }) {

    init { println("Initializing a derived class") }

    override val size: Int =
        (super.size + lastName.length).also { println("Initializing size in the derived class: $it") }
}
//sampleEnd

fun main() {
    println("Constructing the derived class(\"hello\", \"world\")")
    Derived("hello", "world")
}
```
{kotlin-runnable="true"}

これは、基底クラスのコンストラクタが実行される時点で、派生クラスで宣言またはオーバーライドされたプロパティがまだ初期化されていないことを意味します。基底クラスの初期化ロジックでこれらのプロパティのいずれかを使用すると（直接的または別のオーバーライドされた`open`メンバーの実装を介して間接的に）、不正な動作やランタイムエラーにつながる可能性があります。したがって、基底クラスを設計する際は、コンストラクタ、プロパティ初期化子、または`init`ブロックで`open`メンバーを使用することは避けるべきです。

## スーパークラスの実装の呼び出し

派生クラスのコードは、`super`キーワードを使用してスーパークラスの関数やプロパティアクセスの実装を呼び出すことができます。

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("Filling the rectangle")
    }

    val fillColor: String get() = super.borderColor
}
```

内部クラス内で、外部クラスのスーパークラスにアクセスするには、外部クラス名で修飾された`super`キーワード、つまり`super@Outer`を使用します。

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

//sampleStart
class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("Filling") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // Calls Rectangle's implementation of draw()
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Uses Rectangle's implementation of borderColor's get()
        }
    }
}
//sampleEnd

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```
{kotlin-runnable="true"}

## オーバーライドのルール

Kotlinでは、実装の継承は以下の規則によって規定されています。あるクラスが、直接のスーパークラスから同じメンバーの複数の実装を継承する場合、そのクラスはこのメンバーをオーバーライドし、独自の（おそらく継承された実装のいずれかを使用した）実装を提供する必要があります。

継承された実装がどのスーパークラスから取られたかを示すには、山括弧でスーパークラス名を修飾した`super`、例えば`super<Base>`を使用します。

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // interface members are 'open' by default
}

class Square() : Rectangle(), Polygon {
    // The compiler requires draw() to be overridden:
    override fun draw() {
        super<Rectangle>.draw() // call to Rectangle.draw()
        super<Polygon>.draw() // call to Polygon.draw()
    }
}
```

`Rectangle`と`Polygon`の両方から継承することは問題ありませんが、どちらも`draw()`の実装を持つため、曖昧さを解消するために`Square`で`draw()`をオーバーライドし、別の実装を提供する必要があります。