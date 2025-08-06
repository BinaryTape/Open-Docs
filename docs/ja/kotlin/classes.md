[//]: # (title: クラス)

Kotlinのクラスは、`class`キーワードを使用して宣言されます。

```kotlin
class Person { /*...*/ }
```

クラス宣言は、クラス名、クラスヘッダー（型パラメータ、プライマリコンストラクタ、その他を指定）、および中括弧で囲まれたクラス本体で構成されます。ヘッダーと本体はどちらもオプションです。クラスに本体がない場合、中括弧は省略できます。

```kotlin
class Empty
```

## コンストラクタ

Kotlinのクラスには、_プライマリコンストラクタ_と、場合によっては1つまたは複数の_セカンダリコンストラクタ_があります。プライマリコンストラクタはクラスヘッダーで宣言され、クラス名とオプションの型パラメータの後に続きます。

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

プライマリコンストラクタにアノテーションや可視性修飾子がない場合、`constructor`キーワードは省略できます。

```kotlin
class Person(firstName: String) { /*...*/ }
```

プライマリコンストラクタは、クラスヘッダーでクラスインスタンスとそのプロパティを初期化します。クラスヘッダーには実行可能なコードを含めることはできません。オブジェクト生成中にコードを実行したい場合は、クラス本体内で_初期化ブロック_を使用します。初期化ブロックは`init`キーワードに続けて中括弧で宣言されます。実行したいコードは中括弧内に記述します。

インスタンスの初期化中、初期化ブロックは、プロパティ初期化子と交互に、クラス本体に現れる順序と同じ順序で実行されます。

```kotlin
//sampleStart
class InitOrderDemo(name: String) {
    val firstProperty = "First property: $name".also(::println)
    
    init {
        println("First initializer block that prints $name")
    }
    
    val secondProperty = "Second property: ${name.length}".also(::println)
    
    init {
        println("Second initializer block that prints ${name.length}")
    }
}
//sampleEnd

fun main() {
    InitOrderDemo("hello")
}
```
{kotlin-runnable="true"}

プライマリコンストラクタのパラメータは、初期化ブロックで使用できます。また、クラス本体で宣言されたプロパティ初期化子でも使用できます。

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlinには、プライマリコンストラクタからプロパティを宣言し、初期化するための簡潔な構文があります。

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

このような宣言には、クラスのプロパティのデフォルト値を含めることもできます。

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

クラスプロパティを宣言する際に、[末尾のカンマ](coding-conventions.md#trailing-commas)を使用できます。

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

通常のプロパティと同様に、プライマリコンストラクタで宣言されたプロパティは、可変（`var`）または読み取り専用（`val`）にできます。

単なるコンストラクタパラメータ（プロパティではないもの）は、以下でアクセス可能です。
*   クラスヘッダー。
*   クラス本体内の初期化されたプロパティ。
*   初期化ブロック。

例えば：

```kotlin
// widthとheightは単なるコンストラクタパラメータです
class RectangleWithParameters(width: Int, height: Int) {
    val perimeter = 2 * width + 2 * height

    init {
        println("Rectangle created with width = $width and height = $height")
    }
}
```

コンストラクタにアノテーションや可視性修飾子がある場合、`constructor`キーワードは必須であり、修飾子はそれらの前に置かれます。

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

[可視性修飾子](visibility-modifiers.md#constructors)について詳しくはこちら。

### セカンダリコンストラクタ

クラスは_セカンダリコンストラクタ_も宣言でき、これらには`constructor`が前に付きます。

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // このペットを飼い主のペットリストに追加します
    }
}
```

クラスにプライマリコンストラクタがある場合、各セカンダリコンストラクタは、直接的または他のセカンダリコンストラクタを介して間接的に、プライマリコンストラクタに委譲する必要があります。同じクラスの別のコンストラクタへの委譲は、`this`キーワードを使用して行われます。

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

初期化ブロック内のコードは、事実上プライマリコンストラクタの一部となります。プライマリコンストラクタへの委譲は、セカンダリコンストラクタの最初の文にアクセスした時点で発生するため、すべての初期化ブロックとプロパティ初期化子内のコードは、セカンダリコンストラクタの本体の前に実行されます。

クラスにプライマリコンストラクタがない場合でも、委譲は暗黙的に発生し、初期化ブロックはやはり実行されます。

```kotlin
//sampleStart
class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}
//sampleEnd

fun main() {
    Constructors(1)
}
```
{kotlin-runnable="true"}

非抽象クラスがいずれのコンストラクタ（プライマリまたはセカンダリ）も宣言しない場合、引数なしのプライマリコンストラクタが生成されます。そのコンストラクタの可視性はpublicになります。

クラスにpublicなコンストラクタを持たせたくない場合は、デフォルト以外の可視性を持つ空のプライマリコンストラクタを宣言します。

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

> JVM上では、プライマリコンストラクタのすべてのパラメータがデフォルト値を持っている場合、コンパイラはデフォルト値を使用する追加の引数なしコンストラクタを生成します。これにより、JacksonやJPAのような引数なしコンストラクタを介してクラスインスタンスを作成するライブラリとKotlinをより簡単に使用できるようになります。
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
>
{style="note"}

## クラスのインスタンスの作成

クラスのインスタンスを作成するには、コンストラクタを通常の関数のように呼び出します。生成されたインスタンスは[変数](basic-syntax.md#variables)に代入できます。

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

> Kotlinには`new`キーワードはありません。
>
{style="note"}

ネストされた、インナー、および匿名インナークラスのインスタンスを作成するプロセスについては、[ネストされたクラス](nested-classes.md)で説明されています。

## クラスメンバー

クラスは以下を含むことができます：

*   [コンストラクタと初期化ブロック](#constructors)
*   [関数](functions.md)
*   [プロパティ](properties.md)
*   [ネストされたクラスとインナークラス](nested-classes.md)
*   [オブジェクト宣言](object-declarations.md)

## 継承

クラスは互いから派生させることができ、継承階層を形成します。[Kotlinにおける継承について詳しくはこちら](inheritance.md)。

## 抽象クラス

クラスは、そのメンバーの一部またはすべてとともに、`abstract`と宣言できます。抽象メンバーはそのクラスに実装を持ちません。抽象クラスや関数に`open`でアノテーションする必要はありません。

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // 四角形を描画する
    }
}
```

非抽象の`open`メンバーを抽象的なものでオーバーライドできます。

```kotlin
open class Polygon {
    open fun draw() {
        // 何らかのデフォルトの多角形描画メソッド
    }
}

abstract class WildShape : Polygon() {
    // WildShapeを継承するクラスは、Polygonのデフォルトではなく、独自の
    // drawメソッドを提供する必要があります
    abstract override fun draw()
}
```

## コンパニオンオブジェクト

クラスインスタンスを持たずに呼び出すことができ、かつクラスの内部にアクセスする必要がある関数（ファクトリメソッドなど）を記述する必要がある場合、その関数をそのクラス内の[オブジェクト宣言](object-declarations.md)のメンバーとして記述できます。

さらに具体的には、クラス内に[コンパニオンオブジェクト](object-declarations.md#companion-objects)を宣言すると、クラス名を修飾子としてのみ使用してそのメンバーにアクセスできます。