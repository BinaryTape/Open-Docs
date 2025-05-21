---
title: クラス
---
Kotlin のクラスは、キーワード `class` を使って宣言します。

```kotlin
class Person { /*...*/ }
```

クラスの宣言は、クラス名、クラスヘッダー (型引数、primary constructor (主コンストラクタ)、その他の指定)、そして波括弧で囲まれたクラス本体で構成されます。ヘッダーと本体はどちらも省略可能です。クラスに本体がない場合、波括弧を省略できます。

```kotlin
class Empty
```

## Constructors (コンストラクタ)

Kotlin のクラスは、_primary constructor (主コンストラクタ)_ と、場合によっては1つ以上の _secondary constructors (副コンストラクタ)_ を持ちます。primary constructor (主コンストラクタ) はクラスヘッダーで宣言され、クラス名とオプションの型引数の後に記述します。

```kotlin
class Person constructor(firstName: String) { /*...*/ }
```

primary constructor (主コンストラクタ) にアノテーションや可視性修飾子がない場合、`constructor` キーワードは省略できます。

```kotlin
class Person(firstName: String) { /*...*/ }
```

primary constructor (主コンストラクタ) は、クラスのインスタンスとプロパティをクラスヘッダーで初期化します。クラスヘッダーには、実行可能なコードを含めることはできません。オブジェクトの作成中にコードを実行したい場合は、クラス本体内で _initializer blocks (初期化ブロック)_ を使用します。initializer blocks (初期化ブロック) は、`init` キーワードの後に波括弧を付けて宣言します。波括弧の中に実行したいコードを記述します。

インスタンスの初期化中に、initializer blocks (初期化ブロック) はクラス本体に現れる順序で、プロパティの初期化子と交互に実行されます。

```kotlin

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

fun main() {
    InitOrderDemo("hello")
}
```

primary constructor (主コンストラクタ) の引数は、initializer blocks (初期化ブロック) で使用できます。また、クラス本体で宣言されたプロパティの初期化子でも使用できます。

```kotlin
class Customer(name: String) {
    val customerKey = name.uppercase()
}
```

Kotlin には、primary constructor (主コンストラクタ) からプロパティを宣言して初期化するための簡潔な構文があります。

```kotlin
class Person(val firstName: String, val lastName: String, var age: Int)
```

このような宣言には、クラスプロパティのデフォルト値を含めることもできます。

```kotlin
class Person(val firstName: String, val lastName: String, var isEmployed: Boolean = true)
```

クラスプロパティを宣言するときに、[trailing comma](coding-conventions#trailing-commas) を使用できます。

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    var age: Int, // trailing comma
) { /*...*/ }
```

通常のプロパティと同様に、primary constructor (主コンストラクタ) で宣言されたプロパティは、mutable (`var`) または read-only (`val`) にできます。

constructor (コンストラクタ) にアノテーションまたは可視性修飾子がある場合、`constructor` キーワードが必要で、修飾子はキーワードの前に記述します。

```kotlin
class Customer public @Inject constructor(name: String) { /*...*/ }
```

[visibility modifiers (可視性修飾子)](visibility-modifiers#constructors) の詳細をご覧ください。

### Secondary constructors (副コンストラクタ)

クラスは _secondary constructors (副コンストラクタ)_ を宣言することもできます。これらは `constructor` で始まります。

```kotlin
class Person(val pets: MutableList<Pet> = mutableListOf())

class Pet {
    constructor(owner: Person) {
        owner.pets.add(this) // adds this pet to the list of its owner's pets
    }
}
```

クラスに primary constructor (主コンストラクタ) がある場合、各 secondary constructors (副コンストラクタ) は、直接的または別の secondary constructors (副コンストラクタ) を介して間接的に、primary constructor (主コンストラクタ) に委譲する必要があります。同じクラスの別の constructor (コンストラクタ) への委譲は、`this` キーワードを使用して行います。

```kotlin
class Person(val name: String) {
    val children: MutableList<Person> = mutableListOf()
    constructor(name: String, parent: Person) : this(name) {
        parent.children.add(this)
    }
}
```

initializer blocks (初期化ブロック) 内のコードは、事実上 primary constructor (主コンストラクタ) の一部となります。primary constructor (主コンストラクタ) への委譲は、secondary constructors (副コンストラクタ) の最初のステートメントへのアクセス時に行われるため、すべての initializer blocks (初期化ブロック) とプロパティ初期化子のコードは、secondary constructors (副コンストラクタ) の本体の前に実行されます。

クラスに primary constructor (主コンストラクタ) がない場合でも、委譲は暗黙的に行われ、initializer blocks (初期化ブロック) は引き続き実行されます。

```kotlin

class Constructors {
    init {
        println("Init block")
    }

    constructor(i: Int) {
        println("Constructor $i")
    }
}

fun main() {
    Constructors(1)
}
```

非 `abstract` クラスが constructor (主コンストラクタまたは副コンストラクタ) を宣言しない場合、引数のない生成された primary constructor (主コンストラクタ) があります。constructor (コンストラクタ) の可視性は public になります。

クラスに public constructor (コンストラクタ) を持たせたくない場合は、デフォルト以外の可視性を持つ空の primary constructor (主コンストラクタ) を宣言します。

```kotlin
class DontCreateMe private constructor() { /*...*/ }
```

:::note
JVM では、primary constructor (主コンストラクタ) のすべてのパラメーターがデフォルト値を持つ場合、コンパイラーは追加のパラメーターなしのコンストラクターを生成します。このコンストラクターはデフォルト値を使用します。これにより、パラメーターなしのコンストラクターを介してクラスインスタンスを作成する Jackson や JPA などのライブラリで Kotlin を簡単に使用できます。

```kotlin
class Customer(val customerName: String = "")
```

:::

## Creating instances of classes (クラスのインスタンスの作成)

クラスのインスタンスを作成するには、constructor (コンストラクタ) を通常の関数であるかのように呼び出します。作成されたインスタンスを [variable (変数)](basic-syntax#variables) に割り当てることができます。

```kotlin
val invoice = Invoice()

val customer = Customer("Joe Smith")
```

:::note
Kotlin には `new` キーワードはありません。

:::

nested classes (ネストされたクラス)、inner classes (インナークラス)、および anonymous inner classes (匿名インナークラス) のインスタンスを作成するプロセスについては、[Nested classes (ネストされたクラス)](nested-classes) で説明されています。

## Class members (クラスのメンバー)

クラスには、次のものを含めることができます。

* [Constructors and initializer blocks (コンストラクタと初期化ブロック)](classes#constructors)
* [Functions (関数)](functions)
* [Properties (プロパティ)](properties)
* [Nested and inner classes (ネストされたクラスとインナークラス)](nested-classes)
* [Object declarations (オブジェクト宣言)](object-declarations)

## Inheritance (継承)

クラスは互いに派生し、継承階層を形成できます。
[Learn more about inheritance in Kotlin (Kotlin の継承の詳細)](inheritance)。

## Abstract classes (抽象クラス)

クラスは、そのメンバーの一部または全部とともに `abstract` として宣言できます。
`abstract` メンバーは、そのクラスに実装を持ちません。
`abstract` クラスまたは関数に `open` でアノテーションを付ける必要はありません。

```kotlin
abstract class Polygon {
    abstract fun draw()
}

class Rectangle : Polygon() {
    override fun draw() {
        // draw the rectangle
    }
}
```

`abstract` でない `open` メンバーを `abstract` メンバーでオーバーライドできます。

```kotlin
open class Polygon {
    open fun draw() {
        // some default polygon drawing method
    }
}

abstract class WildShape : Polygon() {
    // Classes that inherit WildShape need to provide their own
    // draw method instead of using the default on Polygon
    abstract override fun draw()
}
```

## Companion objects (コンパニオンオブジェクト)

クラスインスタンスを持たずに呼び出すことができ、クラスの内部へのアクセスを必要とする関数 (ファクトリーメソッドなど) を記述する必要がある場合は、そのクラス内の [object declaration (オブジェクト宣言)](object-declarations) のメンバーとして記述できます。

さらに具体的には、クラス内で [companion object (コンパニオンオブジェクト)](object-declarations#companion-objects) を宣言すると、クラス名を修飾子としてのみ使用して、そのメンバーにアクセスできます。