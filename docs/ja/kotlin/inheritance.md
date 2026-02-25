[//]: # (title: 継承)

> クラスによる継承階層を作成する前に、[抽象クラス](classes.md#abstract-classes) または [インターフェース](interfaces.md) の使用を検討してください。 
> 抽象クラスやインターフェースからはデフォルトで継承できます。これらは、他のクラスがそのメンバーを継承して実装できるように設計されています。
>
{style="tip"}

Kotlin のすべてのクラスには、共通のスーパークラス `Any` があります。これは、スーパータイプが宣言されていないクラスのデフォルトのスーパークラスです。

```kotlin
class Example // 暗黙的に Any を継承する
```

`Any` には `equals()`、`hashCode()`、`toString()` の3つのメソッドがあります。そのため、これらのメソッドはすべての Kotlin クラスで定義されています。

デフォルトでは、Kotlin のクラスは final であり、継承することはできません。クラスを継承可能にするには、`open` キーワードを付けます。

```kotlin
open class Base // クラスは継承のために open になっている
```

[詳細については、open キーワードを参照してください](#open-keyword)。

明示的なスーパータイプを宣言するには、クラスヘッダーのコロンの後にその型を記述します。

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

派生クラスにプライマリコンストラクタがある場合、ベースクラスはそのプライマリコンストラクタ内で、そのパラメータに従って初期化されることができます（そして初期化されなければなりません）。

派生クラスにプライマリコンストラクタがない場合、各セカンダリコンストラクタは `super` キーワードを使用してベースタイプを初期化するか、初期化を行う別のコンストラクタに委譲する必要があります。この場合、異なるセカンダリコンストラクタがベースタイプの異なるコンストラクタを呼び出すことができる点に注意してください。

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## open キーワード {id="open-keyword"}

Kotlin では、`open` キーワードはクラスまたはメンバー（関数やプロパティ）がサブクラスでオーバーライド可能であることを示します。
デフォルトでは、Kotlin のクラスとそのメンバーは _final_ です。つまり、明示的に `open` とマークしない限り、継承（クラスの場合）やオーバーライド（メンバーの場合）はできません。

```kotlin
// 継承を許可するために open キーワードを付けたベースクラス
open class Person(
    val name: String
) {
    // サブクラスでオーバーライド可能な open 関数
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// Person を継承し、introduce() 関数をオーバーライドするサブクラス
class Student(
    name: String,
    val school: String
) : Person(name) {
    override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

ベースクラスのメンバーをオーバーライドした場合、そのオーバーライドしたメンバーもデフォルトで open になります。これを変更し、自クラスのサブクラスがその実装をさらにオーバーライドすることを禁止したい場合は、オーバーライドするメンバーを明示的に `final` とマークします。

```kotlin
// 継承を許可するために open キーワードを付けたベースクラス
open class Person(val name: String) {
    // サブクラスでオーバーライド可能な open 関数
    open fun introduce() {
        println("Hello, my name is $name.")
    }
}

// Person を継承し、introduce() 関数をオーバーライドするサブクラス
class Student(name: String, val school: String) : Person(name) {
    // final キーワードにより、サブクラスでのさらなるオーバーライドを防ぐ
    final override fun introduce() {
        println("Hi, I'm $name, and I study at $school.")
    }
}
```

## メソッドのオーバーライド

Kotlin では、オーバーライド可能なメンバーとオーバーライド自体に明示的な修飾子が必要です。

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`Circle.draw()` には `override` 修飾子が必要です。これがないと、コンパイラがエラーを出します。`Shape.fill()` のように関数に `open` 修飾子がない場合、サブクラスで同じシグネチャを持つメソッドを宣言することは、`override` を付けても付けなくても許可されません。`open` 修飾子が指定されていないクラス（final なクラス）のメンバーに `open` 修飾子を付けても、効果はありません。

`override` とマークされたメンバーはそれ自体が open であるため、サブクラスでオーバーライドされる可能性があります。再オーバーライドを禁止したい場合は、`final` を使用してください。

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## プロパティのオーバーライド

プロパティのオーバーライドの仕組みは、メソッドの場合と同じように機能します。スーパークラスで宣言され、派生クラスで再宣言されるプロパティには、`override` を先頭に付ける必要があり、また互換性のある型である必要があります。各宣言されたプロパティは、初期化子を持つプロパティ、または `get` メソッドを持つプロパティによってオーバーライドできます。

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

`val` プロパティを `var` プロパティでオーバーライドすることもできますが、その逆はできません。これが許可されるのは、`val` プロパティが本質的に `get` メソッドを宣言しており、それを `var` としてオーバーライドすることで、派生クラスにさらに `set` メソッドが宣言されることになるからです。

プライマリコンストラクタのプロパティ宣言の一部として `override` キーワードを使用できることに注意してください。

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 常に 4 つの頂点を持つ

class Polygon : Shape {
    override var vertexCount: Int = 0  // 後で任意の数に設定可能
}
```

## 派生クラスの初期化順序

派生クラスの新しいインスタンスの構築中、ベースクラスの初期化が最初のステップとして行われます（ベースクラスのコンストラクタの引数の評価のみが先行します）。つまり、派生クラスの初期化ロジックが実行される前に行われます。

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

これは、ベースクラスのコンストラクタが実行される際、派生クラスで宣言またはオーバーライドされたプロパティはまだ初期化されていないことを意味します。ベースクラスの初期化ロジック内でこれらのプロパティのいずれかを使用すると（直接的、またはオーバーライドされた別の `open` メンバーの実装を介して間接的に）、誤った動作や実行時エラーにつながる可能性があります。したがって、ベースクラスを設計する際には、コンストラクタ、プロパティ初期化子、または `init` ブロックで `open` メンバーを使用することを避けるべきです。

## スーパークラスの実装の呼び出し

派生クラスのコードは、`super` キーワードを使用して、そのスーパークラスの関数やプロパティアクセサの実装を呼び出すことができます。

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

インナークラス内から外部クラスのスーパークラスにアクセスするには、外部クラス名で修飾された `super` キーワード（`super@Outer`）を使用します。

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
            super@FilledRectangle.draw() // Rectangle の draw() 実装を呼び出す
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Rectangle の borderColor の get() 実装を使用する
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

## オーバーライドの規則

Kotlin では、実装の継承は次のルールによって管理されます。クラスが直近のスーパークラスから同じメンバーの複数の実装を継承する場合、そのクラスはそのメンバーをオーバーライドし、独自の実装（場合によっては継承されたものの1つを使用する）を提供しなければなりません。

継承された実装がどのスーパータイプのものであるかを示すには、アングルブラケット（山括弧）で囲まれたスーパータイプ名で修飾された `super`（例：`super<Base>`）を使用します。

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // インターフェースのメンバーはデフォルトで 'open'
}

class Square() : Rectangle(), Polygon {
    // コンパイラは draw() のオーバーライドを要求する:
    override fun draw() {
        super<Rectangle>.draw() // Rectangle.draw() の呼び出し
        super<Polygon>.draw() // Polygon.draw() の呼び出し
    }
}
```

`Rectangle` と `Polygon` の両方を継承することは問題ありませんが、どちらも `draw()` の実装を持っているため、曖昧さを排除するために `Square` で `draw()` をオーバーライドし、それに対して個別の実装を提供する必要があります。