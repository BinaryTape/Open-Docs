[//]: # (title: 継承)

Kotlinのすべてのクラスは共通の親クラス `Any` を持ちます。これは、スーパークラスが宣言されていないクラスのデフォルトの親クラスです。

```kotlin
class Example // 暗黙的にAnyを継承します
```

`Any` には `equals()`、`hashCode()`、`toString()` の3つのメソッドがあります。したがって、これらのメソッドはすべてのKotlinクラスで定義されます。

デフォルトでは、Kotlinのクラスは`final`であり、継承できません。クラスを継承可能にするには、`open`キーワードでマークします。

```kotlin
open class Base // クラスは継承のためにopenです

```

明示的なスーパークラスを宣言するには、クラスヘッダーのコロンの後に型を配置します。

```kotlin
open class Base(p: Int)

class Derived(p: Int) : Base(p)
```

派生クラスにプライマリコンストラクタがある場合、基底クラスはそのパラメータに従って、そのプライマリコンストラクタで初期化できます（そして初期化しなければなりません）。

派生クラスにプライマリコンストラクタがない場合、各セカンダリコンストラクタは`super`キーワードを使用して基底型を初期化するか、それを行う別のコンストラクタに委譲する必要があります。この場合、異なるセカンダリコンストラクタが基底型の異なるコンストラクタを呼び出すことができることに注意してください。

```kotlin
class MyView : View {
    constructor(ctx: Context) : super(ctx)

    constructor(ctx: Context, attrs: AttributeSet) : super(ctx, attrs)
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

`Circle.draw()`には`override`修飾子が必要です。それが欠落している場合、コンパイラがエラーを報告します。`Shape.fill()`のように、関数に`open`修飾子がない場合、`override`があってもなくても、サブクラスで同じシグネチャを持つメソッドを宣言することは許可されません。`open`修飾子のないクラスである`final`クラスのメンバーに追加された場合、`open`修飾子には効果がありません。

`override`とマークされたメンバーはそれ自体が`open`なので、サブクラスでオーバーライドされる可能性があります。再度オーバーライドすることを禁止したい場合は、`final`を使用します。

```kotlin
open class Rectangle() : Shape() {
    final override fun draw() { /*...*/ }
}
```

## プロパティのオーバーライド

オーバーライドメカニズムは、メソッドと同様にプロパティにも適用されます。スーパークラスで宣言され、その後派生クラスで再宣言されるプロパティは、`override`を前に付ける必要があり、互換性のある型を持つ必要があります。各宣言されたプロパティは、初期化子を持つプロパティ、または`get`メソッドを持つプロパティによってオーバーライドできます。

```kotlin
open class Shape {
    open val vertexCount: Int = 0
}

class Rectangle : Shape() {
    override val vertexCount = 4
}
```

`val`プロパティを`var`プロパティでオーバーライドすることはできますが、その逆はできません。これは、`val`プロパティが本質的に`get`メソッドを宣言し、それを`var`としてオーバーライドすることで、派生クラスに追加で`set`メソッドを宣言するためです。

プライマリコンストラクタのプロパティ宣言の一部として`override`キーワードを使用できることに注意してください。

```kotlin
interface Shape {
    val vertexCount: Int
}

class Rectangle(override val vertexCount: Int = 4) : Shape // 常に4つの頂点を持ちます

class Polygon : Shape {
    override var vertexCount: Int = 0  // 後で任意の数値に設定できます
}
```

## 派生クラスの初期化順序

派生クラスの新しいインスタンスを構築する際、基底クラスの初期化が最初に行われます（基底クラスコンストラクタの引数の評価のみが先行します）。これは、派生クラスの初期化ロジックが実行される前に基底クラスの初期化が行われることを意味します。

```kotlin
//sampleStart
open class Base(val name: String) {

    init { println("基底クラスを初期化中") }

    open val size: Int = 
        name.length.also { println("基底クラスでsizeを初期化中: $it") }
}

class Derived(
    name: String,
    val lastName: String,
) : Base(name.replaceFirstChar { it.uppercase() }.also { println("基底クラスへの引数: $it") }) {

    init { println("派生クラスを初期化中") }

    override val size: Int =
        (super.size + lastName.length).also { println("派生クラスでsizeを初期化中: $it") }
}
//sampleEnd

fun main() {
    println("派生クラス(\"hello\", \"world\")を構築中")
    Derived("hello", "world")
}
```
{kotlin-runnable="true"}

これは、基底クラスのコンストラクタが実行されるとき、派生クラスで宣言またはオーバーライドされたプロパティがまだ初期化されていないことを意味します。基底クラスの初期化ロジックでそれらのプロパティのいずれかを使用すると（直接的または別のオーバーライドされた`open`メンバーの実装を介して間接的に）、不正な動作やランタイムエラーにつながる可能性があります。したがって、基底クラスを設計する際は、コンストラクタ、プロパティ初期化子、または`init`ブロックで`open`メンバーを使用することを避けるべきです。

## スーパークラスの実装の呼び出し

派生クラスのコードは、`super`キーワードを使用してスーパークラスの関数やプロパティアクセッサの実装を呼び出すことができます。

```kotlin
open class Rectangle {
    open fun draw() { println("長方形を描画中") }
    val borderColor: String get() = "black"
}

class FilledRectangle : Rectangle() {
    override fun draw() {
        super.draw()
        println("長方形を塗りつぶし中")
    }

    val fillColor: String get() = super.borderColor
}
```

内部クラス内では、外側のクラスのスーパークラスへのアクセスは、外側のクラス名で修飾された`super`キーワード、すなわち`super@Outer`を使用して行われます。

```kotlin
open class Rectangle {
    open fun draw() { println("長方形を描画中") }
    val borderColor: String get() = "black"
}

//sampleStart
class FilledRectangle: Rectangle() {
    override fun draw() {
        val filler = Filler()
        filler.drawAndFill()
    }
    
    inner class Filler {
        fun fill() { println("塗りつぶし中") }
        fun drawAndFill() {
            super@FilledRectangle.draw() // Rectangleのdraw()の実装を呼び出します
            fill()
            println("色 ${super@FilledRectangle.borderColor} の塗りつぶされた長方形が描画されました") // RectangleのborderColorのget()実装を使用します
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

Kotlinでは、実装の継承は次のルールによって規定されています。クラスがその直接のスーパークラスから同じメンバーの複数の実装を継承する場合、そのメンバーをオーバーライドし、独自の（おそらく、継承されたもののいずれかを使用する）実装を提供しなければなりません。

継承された実装が取得されるスーパークラスを示すには、山括弧で囲まれたスーパークラス名で修飾された`super`（例: `super<Base>`)を使用します。

```kotlin
open class Rectangle {
    open fun draw() { /* ... */ }
}

interface Polygon {
    fun draw() { /* ... */ } // インターフェースメンバーはデフォルトで'open'です
}

class Square() : Rectangle(), Polygon {
    // コンパイラはdraw()がオーバーライドされることを要求します:
    override fun draw() {
        super<Rectangle>.draw() // Rectangle.draw()の呼び出し
        super<Polygon>.draw() // Polygon.draw()の呼び出し
    }
}
```

`Rectangle`と`Polygon`の両方から継承することは問題ありませんが、どちらも`draw()`の実装を持っているため、`Square`で`draw()`をオーバーライドし、曖昧さを解消するために個別の実装を提供する必要があります。