[//]: # (title: クラス)

Kotlinでは、クラスは`class`キーワードを使って宣言されます。

```kotlin
class Person { /*...*/ }
```

クラス宣言は、クラス名、クラスヘッダー（型パラメータ、プライマリコンストラクタなどを指定）、そして中括弧で囲まれたクラス本体で構成されます。ヘッダーと本体はどちらもオプションです。クラスに本体がない場合、中括弧は省略できます。

```kotlin
class Empty
```

## コンストラクタ

Kotlinのクラスには、*プライマリコンストラクタ*と、場合によっては1つ以上の*セカンダリコンストラクタ*があります。プライマリコンストラクタはクラスヘッダーで宣言され、クラス名とオプションの型パラメータの後に続きます。

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

プライマリコンストラクタにアノテーションや可視性修飾子がない場合、`constructor`キーワードは省略できます。

```kotlin
class Person(firstName: String) { /*...*/ }
```

プライマリコンストラクタは、クラスインスタンスとそのプロパティをクラスヘッダーで初期化します。クラスヘッダーには実行可能なコードを含めることはできません。オブジェクト作成時にコードを実行したい場合は、クラス本体内で*初期化ブロック*を使用します。初期化ブロックは、`init`キーワードとそれに続く中括弧で宣言されます。実行したいコードはすべて中括弧内に記述します。

インスタンスの初期化中、初期化ブロックはクラス本体に現れるのと同じ順序で、プロパティの初期化と交互に実行されます。

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

プライマリコンストラクタのパラメータは初期化ブロックで使用できます。また、クラス本体で宣言されたプロパティの初期化子でも使用できます。

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlinには、プライマリコンストラクタからプロパティを宣言および初期化するための簡潔な構文があります。

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

このような宣言には、クラスプロパティのデフォルト値を含めることもできます。

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

通常のプロパティと同様に、プライマリコンストラクタで宣言されたプロパティは可変（`var`）または読み取り専用（`val`）にできます。

コンストラクタにアノテーションや可視性修飾子がある場合、`constructor`キーワードは必須となり、修飾子はそれよりも前に配置されます。

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

[可視性修飾子](visibility-modifiers.md#constructors)についてさらに詳しく学びましょう。

### セカンダリコンストラクタ

クラスは、`constructor`がプレフィックスとして付く*セカンダリコンストラクタ*も宣言できます。

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // このペットをオーナーのペットリストに追加します
    }
}
```

クラスにプライマリコンストラクタがある場合、各セカンダリコンストラクタは、直接的または他のセカンダリコンストラクタを介して間接的に、プライマリコンストラクタに委譲する必要があります。同じクラスの別のコンストラクタへの委譲は、`this`キーワードを使って行われます。

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

初期化ブロック内のコードは、実質的にプライマリコンストラクタの一部となります。プライマリコンストラクタへの委譲は、セカンダリコンストラクタの最初のステートメントにアクセスした瞬間に発生するため、すべての初期化ブロックおよびプロパティ初期化子内のコードは、セカンダリコンストラクタの本体の前に実行されます。

クラスにプライマリコンストラクタがない場合でも、委譲は暗黙的に行われ、初期化ブロックはやはり実行されます。

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

非抽象クラスがコンストラクタ（プライマリまたはセカンダリ）を一切宣言しない場合、引数なしのプライマリコンストラクタが自動生成されます。そのコンストラクタの可視性は`public`になります。

クラスに`public`なコンストラクタを持たせたくない場合は、デフォルト以外の可視性を持つ空のプライマリコンストラクタを宣言します。

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

> JVM上では、プライマリコンストラクタのすべてのパラメータがデフォルト値を持つ場合、コンパイラはデフォルト値を使用する追加の引数なしコンストラクタを生成します。これにより、引数なしコンストラクタを介してクラスインスタンスを作成するJacksonやJPAなどのライブラリとKotlinをより簡単に使用できるようになります。
>
> ```kotlin
> class Customer(val customerName: String = "")
> ```
>
{style="note"}

## クラスのインスタンスの作成

クラスのインスタンスを作成するには、コンストラクタを通常の関数のように呼び出します。作成されたインスタンスを[変数](basic-syntax.md#variables)に割り当てることができます。

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

> Kotlinには`new`キーワードはありません。
>
{style="note"}

ネストされたクラス、インナークラス、匿名インナークラスのインスタンス作成プロセスについては、[ネストされたクラス](nested-classes.md)で説明されています。

## クラスメンバー

クラスは以下を含むことができます。

*   [コンストラクタと初期化ブロック](#constructors)
*   [関数](functions.md)
*   [プロパティ](properties.md)
*   [ネストされたクラスとインナークラス](nested-classes.md)
*   [オブジェクト宣言](object-declarations.md)

## 継承

クラスは互いに派生し、継承階層を形成できます。
[Kotlinの継承についてさらに詳しく知る](inheritance.md)。

## 抽象クラス

クラスは、そのメンバーの一部またはすべてとともに`abstract`として宣言できます。
抽象メンバーは、そのクラスに実装を持ちません。
抽象クラスや関数に`open`アノテーションを付ける必要はありません。

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // 長方形を描画します
    }
}
```

非抽象の`open`メンバーを抽象メンバーでオーバーライドできます。

```kotlin
open class Polygon {
    open fun draw() {
        // いくつかのデフォルトの多角形描画メソッド
    }
}

abstract class WildShape : Polygon() {
    // WildShapeを継承するクラスは、Polygonのデフォルトを使用する代わりに
    // 独自のdrawメソッドを提供する必要があります
    abstract override fun draw()
}
```

## コンパニオンオブジェクト

クラスのインスタンスを持たずに呼び出せるが、クラスの内部（ファクトリメソッドなど）にアクセスする必要がある関数を記述する必要がある場合、それをそのクラス内の[オブジェクト宣言](object-declarations.md)のメンバーとして記述できます。

さらに具体的には、クラス内に[コンパニオンオブジェクト](object-declarations.md#companion-objects)を宣言すると、クラス名のみを修飾子として使用してそのメンバーにアクセスできます。