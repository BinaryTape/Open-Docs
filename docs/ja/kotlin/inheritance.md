---
title: 継承
---
Kotlin のすべてのクラスは共通の基底クラス `Any` を持ちます。これは、スーパークラスが宣言されていないクラスのデフォルトのスーパークラスです。

```kotlin
class Example // 暗黙的に Any を継承する
```

`Any` は、`equals()`、`hashCode()`、および `toString()` の 3 つのメソッドを持ちます。したがって、これらのメソッドはすべての Kotlin クラスで定義されます。

デフォルトでは、Kotlin のクラスは `final` です。つまり、継承できません。クラスを継承可能にするには、`open` キーワードでマークします。

```kotlin
open class Base // クラスは継承に対して open である

```

明示的なスーパークラスを宣言するには、クラスヘッダーでコロンの後に型を記述します。

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

派生クラスがプライマリコンストラクタを持つ場合、基底クラスは、そのパラメータに従って、そのプライマリコンストラクタで初期化できます（そして初期化しなければなりません）。

派生クラスがプライマリコンストラクタを持たない場合、各セカンダリコンストラクタは `super` キーワードを使用して基底クラスを初期化するか、それを行う別のコンストラクタに委譲する必要があります。この場合、異なるセカンダリコンストラクタが基底クラスの異なるコンストラクタを呼び出すことができることに注意してください。

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
}
```

## メソッドのオーバーライド

Kotlin では、オーバーライド可能なメンバーとオーバーライドには明示的な修飾子が必要です。

```kotlin
open class Shape {
    open fun draw() { /*...*/ }
    fun fill() { /*...*/ }
}

class Circle() : Shape() {
    override fun draw() { /*...*/ }
}
```

`override` 修飾子は `Circle.draw()` に必須です。これがないと、コンパイラは文句を言います。`Shape.fill()` のように関数に `open` 修飾子がない場合、サブクラスで同じシグネチャを持つメソッドを `override` の有無にかかわらず宣言することはできません。`open` 修飾子は、`open` 修飾子のないクラスである `final` クラスのメンバーに追加しても効果はありません。

`override` でマークされたメンバー自体は `open` なので、サブクラスでオーバーライドできます。再オーバーライドを禁止する場合は、`final` を使用します。

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## プロパティのオーバーライド

オーバーライドのメカニズムは、メソッドと同じようにプロパティにも適用されます。スーパークラスで宣言され、派生クラスで再宣言されたプロパティには、`override` を前に付ける必要があり、互換性のある型を持っている必要があります。宣言された各プロパティは、イニシャライザを持つプロパティまたは `get` メソッドを持つプロパティによってオーバーライドできます。

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

`val` プロパティを `var` プロパティでオーバーライドすることもできますが、その逆はできません。`val` プロパティは本質的に `get` メソッドを宣言し、それを `var` としてオーバーライドすると、派生クラスで `set` メソッドが追加で宣言されるため、これは許可されています。

プライマリコンストラクタのプロパティ宣言の一部として `override` キーワードを使用できることに注意してください。

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 常に 4 つの頂点を持つ

class Polygon : Shape {
    override var vertexCount: Int = 0  // 後で任意の数に設定できる
}
```

## 派生クラスの初期化順序

派生クラスの新しいインスタンスの構築中、基底クラスの初期化は最初の手順として行われます（基底クラスコンストラクタの引数の評価のみが先行します）。つまり、派生クラスの初期化ロジックが実行される前に発生します。

```kotlin

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

fun main() {
    println("Constructing the derived class(\"hello\", \"world\")")
    Derived("hello", "world")
}
```

これは、基底クラスのコンストラクタが実行されるとき、派生クラスで宣言またはオーバーライドされたプロパティはまだ初期化されていないことを意味します。基底クラスの初期化ロジックでこれらのプロパティ（直接的または別のオーバーライドされた `open` メンバー実装を介して間接的に）を使用すると、正しくない動作またはランタイムエラーが発生する可能性があります。基底クラスを設計するときは、コンストラクタ、プロパティイニシャライザ、または `init` ブロックで `open` メンバーを使用することを避ける必要があります。

## スーパークラスの実装の呼び出し

派生クラスのコードは、`super` キーワードを使用して、スーパークラスの関数とプロパティアクセサの実装を呼び出すことができます。

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

インナークラス内では、外側のクラスのスーパークラスへのアクセスは、外側のクラス名で修飾された `super` キーワード (`super@Outer`) を使用して行われます。

```kotlin
open class Rectangle {
    open fun draw() { println("Drawing a rectangle") }
    val borderColor: String get() = "black"
}

class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("Filling") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // Rectangle の draw() の実装を呼び出す
            fill()
            println("Drawn a filled rectangle with color ${super@FilledRectangle.borderColor}") // Rectangle の borderColor の get() の実装を使用する
        }
    }
}

fun main() {
    val fr = FilledRectangle()
        fr.draw()
}
```

## オーバーライドのルール

Kotlin では、実装の継承は次のルールによって規制されています。クラスがその直接のスーパークラスから同じメンバーの複数の実装を継承する場合、このメンバーをオーバーライドして、独自の実装を提供する必要があります（おそらく、継承されたものの 1 つを使用します）。

継承された実装が取得されたスーパークラスを示すには、山括弧で囲まれたスーパークラス名で修飾された `super` (`super<Base>`) を使用します。

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // インターフェースメンバーはデフォルトで 'open' です
}

class Square() : Rectangle(), Polygon {
    // コンパイラは draw() がオーバーライドされることを要求します。
    override fun draw() {
        super<Rectangle>.draw() // Rectangle.draw() の呼び出し
        super<Polygon>.draw() // Polygon.draw() の呼び出し
    }
}
```

`Rectangle` と `Polygon` の両方から継承しても問題ありませんが、どちらも `draw()` の実装を持っているため、`Square` で `draw()` をオーバーライドし、あいまいさを解消するために個別の実装を提供する必要があります。