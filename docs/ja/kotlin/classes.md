[//]: # (title: クラス)

> クラスを作成する前に、目的がデータの保存であるなら [データクラス](data-classes.md) の使用を検討してください。
> あるいは、既存のクラスを最初から作り直すのではなく、[拡張](extensions.md) で既存のクラスを拡張することを考えてみましょう。
>
{style="tip"}

他のオブジェクト指向言語と同様に、Kotlin では、再利用可能で構造化されたコードのために、データ（プロパティ）と振る舞い（関数）をカプセル化するために *クラス* を使用します。

クラスはオブジェクトの設計図（ブループリント）またはテンプレートであり、[コンストラクタ](#constructors-and-initializer-blocks) を介して作成します。[インスタンスを作成](#creating-instances) すると、その設計図に基づいた具体的なオブジェクトを作成することになります。

Kotlin はクラスを宣言するための簡潔な構文を提供します。クラスを宣言するには、`class` キーワードの後にクラス名を記述します。

```kotlin
class Person { /*...*/ }
```

クラス宣言は以下で構成されます：
* **クラスヘッダー**: 以下を含みますが、これらに限定されません：
  * `class` キーワード
  * クラス名
  * 型パラメータ（もしあれば）
  * [プライマリコンストラクタ](#primary-constructor)（オプション）
* **クラスボディ**（オプション）: 波括弧 `{}` で囲まれ、次のような **クラスメンバー** を含みます：
  * [セカンダリコンストラクタ](#secondary-constructors)
  * [初期化ブロック](#initializer-blocks)
  * [関数](functions.md)
  * [プロパティ](properties.md)
  * [ネストしたクラスと内部クラス](nested-classes.md)
  * [オブジェクト宣言](object-declarations.md)

クラスヘッダーとボディの両方を最小限に抑えることができます。クラスにボディがない場合は、波括弧 `{}` を省略できます。

```kotlin
// プライマリコンストラクタを持つが、ボディのないクラス 
class Person(val name: String, var age: Int)
```

以下は、ヘッダーとボディを持つクラスを宣言し、そこから [インスタンスを作成](#creating-instances) する例です：

```kotlin
// name プロパティを初期化する
// プライマリコンストラクタを持つ Person クラス
class Person(val name: String) {
    // age プロパティを持つクラスボディ
    var age: Int = 0
}

fun main() {
    // コンストラクタを呼び出して Person クラスのインスタンスを作成する
    val person = Person("Alice")

    // インスタンスのプロパティにアクセスする
    println(person.name)
    // Alice
    println(person.age)
    // 0
}
```
{kotlin-runnable="true" id="class-with-header-and-body"}

## インスタンスの作成

インスタンスは、プログラム内で操作するための実際のオブジェクトを構築するために、クラスを設計図として使用するときに作成されます。

クラスのインスタンスを作成するには、[関数](functions.md) を呼び出すのと同様に、クラス名の後に括弧 `()` を付けます。

```kotlin
// Person クラスのインスタンスを作成する
val anonymousUser = Person()
```

Kotlin では、以下の方法でインスタンスを作成できます：

* **引数なし** (`Person()`): デフォルト値がクラスで宣言されている場合、それらを使用してインスタンスを作成します。
* **引数あり** (`Person(value)`): 特定の値を渡してインスタンスを作成します。

作成したインスタンスは、ミュータブル（`var`）またはリードオンリー（`val`）の [変数](basic-syntax.md#variables) に代入できます。

```kotlin
// デフォルト値を使用してインスタンスを作成し、
// ミュータブルな変数に代入する
var anonymousUser = Person()

// 特定の値を渡してインスタンスを作成し、
// リードオンリーな変数に代入する
val namedUser = Person("Joe")
```

インスタンスは、[`main()` 関数](basic-syntax.md#program-entry-point) 内、他の関数内、または別のクラス内など、必要な場所で作成できます。さらに、別の関数内でインスタンスを作成し、その関数を `main()` から呼び出すこともできます。

次のコードは、名前を保存するためのプロパティを持つ `Person` クラスを宣言しています。また、デフォルトのコンストラクタ値と特定の値の両方を使用してインスタンスを作成する方法も示しています。

```kotlin
// デフォルト値で name を初期化する
// プライマリコンストラクタを持つクラスヘッダー
class Person(val name: String = "Sebastian")

fun main() {
    // デフォルトのコンストラクタ値を使用してインスタンスを作成する
    val anonymousUser = Person()

    // 特定の値を渡してインスタンスを作成する
    val namedUser = Person("Joe")

    // インスタンスの name プロパティにアクセスする
    println(anonymousUser.name)
    // Sebastian
    println(namedUser.name)
    // Joe
}
```
{kotlin-runnable="true" id="create-instance-of-a-class"}

> Kotlin では、他のオブジェクト指向プログラミング言語とは異なり、クラスのインスタンスを作成するときに `new` キーワードを使用する必要はありません。
>
{style="note"}

ネストしたクラス、内部クラス、および匿名内部クラスのインスタンス作成に関する情報は、[ネストしたクラス](nested-classes.md) セクションを参照してください。

## コンストラクタと初期化ブロック

クラスのインスタンスを作成するとき、そのコンストラクタの 1 つを呼び出します。Kotlin のクラスは、1 つの [_プライマリコンストラクタ_](#primary-constructor) と、1 つ以上の [_セカンダリコンストラクタ_](#secondary-constructors) を持つことができます。

プライマリコンストラクタは、クラスを初期化する主な方法です。クラスヘッダーで宣言します。セカンダリコンストラクタは、追加の初期化ロジックを提供します。クラスボディで宣言します。

プライマリコンストラクタとセカンダリコンストラクタはどちらもオプションですが、クラスには少なくとも 1 つのコンストラクタが必要です。

### プライマリコンストラクタ

プライマリコンストラクタは、インスタンスが [作成される](#creating-instances) ときに、その初期状態をセットアップします。

プライマリコンストラクタを宣言するには、クラス名の後のクラスヘッダーに配置します。

```kotlin
class Person constructor(name: String) { /*...*/ }
```

プライマリコンストラクタに [アノテーション](annotations.md) や [可視性モディファイア](visibility-modifiers.md#constructors) がない場合は、`constructor` キーワードを省略できます。

```kotlin
class Person(name: String) { /*...*/ }
```

プライマリコンストラクタは、パラメータをプロパティとして宣言できます。リードオンリーなプロパティを宣言するには引数名の前に `val` キーワードを使用し、ミュータブルなプロパティには `var` キーワードを使用します。

```kotlin
class Person(val name: String, var age: Int) { /*...*/ }
```

これらのコンストラクタパラメータプロパティはインスタンスの一部として保存され、クラスの外部からアクセス可能です。

また、プロパティではないプライマリコンストラクタパラメータを宣言することも可能です。これらのパラメータには前に `val` や `var` が付かないため、インスタンスには保存されず、クラスボディ内でのみ利用可能です。

```kotlin
// プロパティでもあるプライマリコンストラクタパラメータ
class PersonWithProperty(val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}

// プライマリコンストラクタパラメータのみ（プロパティとして保存されない）
class PersonWithAssignment(name: String) {
    // 後で使用できるようにプロパティに代入する必要がある
    val displayName: String = name
    
    fun greet() {
        println("Hello, $displayName")
    }
}
```

プライマリコンストラクタで宣言されたプロパティは、クラスの [メンバー関数](functions.md) からアクセスできます。

```kotlin
// プロパティを宣言するプライマリコンストラクタを持つクラス
class Person(val name: String, var age: Int) {
    // クラスプロパティにアクセスするメンバー関数
    fun introduce(): String {
        return "Hi, I'm $name and I'm $age years old."
    }
}
```

プライマリコンストラクタのプロパティにデフォルト値を割り当てることもできます。

```kotlin
class Person(val name: String = "John", var age: Int = 30) { /*...*/ }
```

[インスタンス作成](#creating-instances) 時にコンストラクタに値が渡されない場合、プロパティはデフォルト値を使用します。

```kotlin
// name と age のデフォルト値を含む
// プライマリコンストラクタを持つクラス
class Person(val name: String = "John", var age: Int = 30)

fun main() {
    // デフォルト値を使用してインスタンスを作成する
    val person = Person()
    println("Name: ${person.name}, Age: ${person.age}")
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-primary-constructor"}

プライマリコンストラクタのパラメータを使用して、クラスボディ内で直接追加のクラスプロパティを初期化できます。

```kotlin
// name と age のデフォルト値を含む
// プライマリコンストラクタを持つクラス
class Person(
    val name: String = "John",
    var age: Int = 30
) {
    // プライマリコンストラクタのパラメータから
    // description プロパティを初期化する
    val description: String = "Name: $name, Age: $age"
}

fun main() {
    // Person クラスのインスタンスを作成する
    val person = Person()
    // description プロパティにアクセスする
    println(person.description)
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-default-values"}

関数と同様に、コンストラクタ宣言で [末尾のカンマ](coding-conventions.md#trailing-commas) を使用できます。

```kotlin
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
) { /*...*/ }
```

### 初期化ブロック

プライマリコンストラクタはクラスを初期化し、そのプロパティを設定します。ほとんどの場合、これは単純なコードで処理できます。

[インスタンス作成](#creating-instances) 中に、より複雑な操作を実行する必要がある場合は、そのロジックをクラスボディ内の *初期化ブロック* に配置します。これらのブロックは、プライマリコンストラクタの実行時に実行されます。

初期化ブロックは、`init` キーワードの後に波括弧 `{}` を付けて宣言します。初期化中に実行したいコードを波括弧の中に記述します。

```kotlin
// name と age を初期化するプライマリコンストラクタを持つクラス
class Person(val name: String, var age: Int) {
    init {
        // 初期化ブロックはインスタンスの作成時に実行される
        println("Person created: $name, age $age.")
    }
}

fun main() {
    // Person クラスのインスタンスを作成する
    Person("John", 30)
    // Person created: John, age 30.
}
```
{kotlin-runnable="true" id="class-with-initializer-block"}

必要な数だけ初期化ブロック（`init {}`）を追加できます。これらは、プロパティの初期化子と共に、クラスボディに現れる順序で実行されます。

```kotlin
//sampleStart
// name と age を初期化するプライマリコンストラクタを持つクラス
class Person(val name: String, var age: Int) {
    // 最初の初期化ブロック
    init {
        // インスタンス作成時に最初に実行される
        println("Person created: $name, age $age.")
    }

    // 2 番目の初期化ブロック
    init {
        // 最初の初期化ブロックの後に実行される
        if (age < 18) {
            println("$name is a minor.")
        } else {
            println("$name is an adult.")
        }
    }
}

fun main() {
    // Person クラスのインスタンスを作成する
    Person("John", 30)
    // Person created: John, age 30.
    // John is an adult.
}
//sampleEnd
```
{kotlin-runnable="true" id="class-with-second-initializer-block"}

初期化ブロックではプライマリコンストラクタのパラメータを使用できます。例えば、上記のコードでは、最初の初期化子と 2 番目の初期化子の両方で、プライマリコンストラクタからの `name` と `age` パラメータを使用しています。

`init` ブロックの一般的なユースケースはデータのバリデーションです。例えば、[`require` 関数](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/require.html) を呼び出すことによって行います：

```kotlin
class Person(val age: Int) {
    init {
        require(age > 0) { "age must be positive" }
    }
}
```

### セカンダリコンストラクタ

Kotlin では、セカンダリコンストラクタは、プライマリコンストラクタ以外にクラスが持つことができる追加のコンストラクタです。セカンダリコンストラクタは、クラスを初期化するための複数の方法が必要な場合や、[Java との相互運用性](java-to-kotlin-interop.md) のために役立ちます。

セカンダリコンストラクタを宣言するには、クラスボディ内で `constructor` キーワードを使用し、括弧 `()` 内にコンストラクタパラメータを記述します。波括弧 `{}` 内にコンストラクタのロジックを追加します。

```kotlin
// name と age を初期化するプライマリコンストラクタを持つクラスヘッダー
class Person(val name: String, var age: Int) {

    // age を String として受け取り、
    // それを Int に変換するセカンダリコンストラクタ
    constructor(name: String, age: String) : this(name, age.toIntOrNull() ?: 0) {
        println("$name created with converted age: ${this.age}")
    }
}

fun main() {
    // age を String として受け取るセカンダリコンストラクタを使用する
    Person("Bob", "8")
    // Bob created with converted age: 8
}
```
{kotlin-runnable="true" id="class-with-secondary-constructor"}

> `age.toIntOrNull() ?: 0` という式はエルビス演算子を使用しています。詳細については、[Null 安全性](null-safety.md#elvis-operator) を参照してください。
>
{style="tip"}

上記のコードでは、セカンダリコンストラクタは `this` キーワードを介してプライマリコンストラクタに委譲し、`name` と整数に変換された `age` の値を渡しています。

Kotlin では、セカンダリコンストラクタはプライマリコンストラクタに委譲する必要があります。この委譲により、セカンダリコンストラクタのロジックが実行される前に、すべてのプライマリコンストラクタの初期化ロジックが確実に実行されます。

コンストラクタの委譲には以下の種類があります：
* **直接的**: セカンダリコンストラクタが即座にプライマリコンストラクタを呼び出す場合。
* **間接的**: あるセカンダリコンストラクタが別のセカンダリコンストラクタを呼び出し、それが最終的にプライマリコンストラクタに委譲する場合。

直接的および間接的な委譲がどのように機能するかを示す例を以下に示します：

```kotlin
// name と age を初期化するプライマリコンストラクタを持つクラスヘッダー
class Person(
    val name: String,
    var age: Int
) {
    // プライマリコンストラクタへの 
    // 直接的な委譲を行うセカンダリコンストラクタ
    constructor(name: String) : this(name, 0) {
        println("Person created with default age: $age and name: $name.")
    }

    // 間接的な委譲を行うセカンダリコンストラクタ： 
    // this("Bob") -> constructor(name: String) -> primary constructor
    constructor() : this("Bob") {
        println("New person created with default age: $age and name: $name.")
    }
}

fun main() {
    // 直接的な委譲に基づくインスタンス作成
    Person("Alice")
    // Person created with default age: 0 and name: Alice.

    // 間接的な委譲に基づくインスタンス作成
    Person()
    // Person created with default age: 0 and name: Bob.
    // New person created with default age: 0 and name: Bob.
}
```
{kotlin-runnable="true" id="class-delegation"}

初期化ブロック（`init {}`）を持つクラスでは、これらのブロック内のコードはプライマリコンストラクタの一部になります。セカンダリコンストラクタは最初にプライマリコンストラクタに委譲するため、すべての初期化ブロックとプロパティ初期化子はセカンダリコンストラクタのボディよりも前に実行されます。クラスにプライマリコンストラクタがない場合でも、委譲は暗黙的に発生します。

```kotlin
// プライマリコンストラクタのないクラスヘッダー
class Person {
    // 初期化ブロックはインスタンスの作成時に実行される
    init {
        // セカンダリコンストラクタの前に実行される
        println("1. First initializer block runs")
    }

    // 整数パラメータを受け取るセカンダリコンストラクタ
    constructor(i: Int) {
        // 初期化ブロックの後に実行される
        println("2. Person $i is created")
    }
}

fun main() {
    // Person クラスのインスタンスを作成する
    Person(1)
    // 1. First initializer block runs
    // 2. Person 1 created
}
```
{kotlin-runnable="true" id="class-delegation-sequence"}

### コンストラクタのないクラス

コンストラクタ（プライマリまたはセカンダリ）を宣言していないクラスには、パラメータのない暗黙的なプライマリコンストラクタがあります。

```kotlin
// 明示的なコンストラクタのないクラス
class Person {
    // プライマリまたはセカンダリコンストラクタが宣言されていない
}

fun main() {
    // 暗黙的なプライマリコンストラクタを使用して 
    // Person クラスのインスタンスを作成する
    val person = Person()
}
```

この暗黙的なプライマリコンストラクタの可視性は `public` であり、どこからでもアクセスできることを意味します。クラスに公開コンストラクタを持たせたくない場合は、デフォルト以外の可視性を持つ空のプライマリコンストラクタを宣言してください。

```kotlin
class Person private constructor() { /*...*/ }
```

> JVM では、すべてのプライマリコンストラクタパラメータにデフォルト値がある場合、コンパイラはそれらのデフォルト値を使用する引数なしのコンストラクタを暗黙的に提供します。
> 
> これにより、引数なしのコンストラクタを介してクラスインスタンスを作成する [Jackson](https://github.com/FasterXML/jackson) や [Spring Data JPA](https://spring.io/projects/spring-data-jpa) などのライブラリで Kotlin を使いやすくなります。
>
> 次の例では、Kotlin はデフォルト値 `""` を使用する引数なしのコンストラクタ `Person()` を暗黙的に提供します。
> 
> ```kotlin
> class Person(val personName: String = "")
> ```
>
{style="note"}

## 継承

Kotlin におけるクラスの継承を使用すると、既存のクラス（ベースクラス）から新しいクラス（派生クラス）を作成し、そのプロパティと関数を継承しながら、振る舞いを追加または変更できます。

継承の階層や `open` キーワードの使用方法に関する詳細は、[継承](inheritance.md) セクションを参照してください。

## 抽象クラス

Kotlin において、抽象クラス（abstract class）は直接インスタンス化できないクラスです。これらは、実際の振る舞いを定義する他のクラスによって継承されるように設計されています。この振る舞いは *実装（implementation）* と呼ばれます。

抽象クラスは抽象プロパティや抽象関数を宣言でき、それらはサブクラスで実装されなければなりません。

抽象クラスもコンストラクタを持つことができます。これらのコンストラクタはクラスプロパティを初期化し、サブクラスに必要なパラメータを強制します。抽象クラスを宣言するには `abstract` キーワードを使用します。

```kotlin
abstract class Person(val name: String, val age: Int)
```

抽象クラスは、抽象メンバーと非抽象メンバー（プロパティと関数）の両方を持つことができます。メンバーを抽象として宣言するには、明示的に `abstract` キーワードを使用する必要があります。

抽象クラスや抽象関数には `open` キーワードを付ける必要はありません。なぜなら、それらはデフォルトで暗黙的に継承可能だからです。`open` キーワードの詳細については、[継承](inheritance.md#open-keyword) を参照してください。

抽象メンバーは抽象クラス内に実装を持ちません。サブクラスまたは継承クラスにおいて、`override` 関数またはプロパティを使用して実装を定義します。

```kotlin
// name と age を宣言するプライマリコンストラクタを持つ抽象クラス
abstract class Person(
    val name: String,
    val age: Int
) {
    // 抽象メンバー 
    // 実装は提供されず、
    // サブクラスで実装されなければならない
    abstract fun introduce()

    // 非抽象メンバー（実装を持つ）
    fun greet() {
        println("Hello, my name is $name.")
    }
}

// 抽象メンバーの実装を提供するサブクラス
class Student(
    name: String,
    age: Int,
    val school: String
) : Person(name, age) {
    override fun introduce() {
        println("I am $name, $age years old, and I study at $school.")
    }
}

fun main() {
    // Student クラスのインスタンスを作成する
    val student = Student("Alice", 20, "Engineering University")
    
    // 非抽象メンバーを呼び出す
    student.greet()
    // Hello, my name is Alice.
    
    // オーバーライドされた抽象メンバーを呼び出す
    student.introduce()
    // I am Alice, 20 years old, and I study at Engineering University.
}
```
{kotlin-runnable="true" id="abstract-class"}

## コンパニオンオブジェクト

Kotlin では、各クラスに 1 つの [コンパニオンオブジェクト](object-declarations.md#companion-objects) を持たせることができます。コンパニオンオブジェクトは、クラスのインスタンスを作成せずにクラス名を使用してそのメンバーにアクセスできるようにするオブジェクト宣言の一種です。

クラスのインスタンスを作成せずに呼び出せる関数を作成する必要があり、かつその関数が論理的にクラスに関連付けられている（ファクトリ関数など）場合、クラス内のコンパニオン [オブジェクト宣言](object-declarations.md) の内部でそれを宣言できます。

```kotlin
// name プロパティを宣言するプライマリコンストラクタを持つクラス
class Person(
    val name: String
) {
    // コンパニオンオブジェクトを持つクラスボディ
    companion object {
        fun createAnonymous() = Person("Anonymous")
    }
}

fun main() {
    // クラスのインスタンスを作成せずに関数を呼び出す
    val anonymous = Person.createAnonymous()
    println(anonymous.name)
    // Anonymous
}
```
{kotlin-runnable="true" id="class-with-companion-object"}

クラス内にコンパニオンオブジェクトを宣言すると、クラス名のみを修飾子として使用してそのメンバーにアクセスできます。

詳細については、[コンパニオンオブジェクト](object-declarations.md#companion-objects) を参照してください。