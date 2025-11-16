[//]: # (title: クラス)

> クラスを作成する前に、目的がデータを保存することである場合は、[データクラス](data-classes.md)の使用を検討してください。
> あるいは、ゼロから新しいクラスを作成するのではなく、[拡張機能](extensions.md)を使用して既存のクラスを拡張することを検討してください。
>
{style="tip"}

他のオブジェクト指向言語と同様に、Kotlinは_クラス_を使用して、再利用可能で構造化されたコードのために、データ（プロパティ）と振る舞い（関数）をカプセル化します。

クラスはオブジェクトの設計図またはテンプレートであり、[コンストラクタ](#constructors-and-initializer-blocks)を介して作成します。 [クラスのインスタンスを作成する](#creating-instances)とき、あなたはその設計図に基づいた具体的なオブジェクトを作成しています。

Kotlinはクラスを宣言するための簡潔な構文を提供します。クラスを宣言するには、`class`キーワードの後にクラス名を記述します。

```kotlin
class Person { /*...*/ }
```

クラス宣言は以下で構成されます。
*   **クラスヘッダー**。以下を含むが、これらに限定されない。
    *   `class`キーワード
    *   クラス名
    *   型パラメータ（もしあれば）
    *   [プライマリコンストラクタ](#primary-constructor)（オプション）
*   **クラス本体**（オプション）。中括弧`{}`で囲まれ、次のような**クラスメンバー**を含む。
    *   [セカンダリコンストラクタ](#secondary-constructors)
    *   [初期化ブロック](#initializer-blocks)
    *   [関数](functions.md)
    *   [プロパティ](properties.md)
    *   [ネストされたクラスとインナークラス](nested-classes.md)
    *   [オブジェクト宣言](object-declarations.md)

クラスヘッダーと本体の両方を必要最低限に抑えることができます。クラスに本体がない場合、中括弧`{}`は省略できます。

```kotlin
// プライマリコンストラクタを持つが、本体がないクラス
class Person(val name: String, var age: Int)
```

以下は、ヘッダーと本体を持つクラスを宣言し、そこから[インスタンスを作成する](#creating-instances)例です。

```kotlin
// nameプロパティを初期化するプライマリコンストラクタを持つPersonクラス
class Person(val name: String) {
    // ageプロパティを持つクラス本体
    var age: Int = 0
}

fun main() {
    // コンストラクタを呼び出してPersonクラスのインスタンスを作成します
    val person = Person("Alice")

    // インスタンスのプロパティにアクセスします
    println(person.name)
    // Alice
    println(person.age)
    // 0
}
```
{kotlin-runnable="true" id="class-with-header-and-body"}

## インスタンスの作成

インスタンスは、プログラム内で扱う実際のオブジェクトを構築するためにクラスを設計図として使用するときに作成されます。

クラスのインスタンスを作成するには、[関数](functions.md)を呼び出すのと同様に、クラス名の後に括弧`()`を付けて使用します。

```kotlin
// Personクラスのインスタンスを作成します
val anonymousUser = Person()
```

Kotlinでは、次の方法でインスタンスを作成できます。

*   **引数なし**（`Person()`）：クラスで宣言されている場合、デフォルト値を使用してインスタンスを作成します。
*   **引数あり**（`Person(value)`）：特定の値を渡してインスタンスを作成します。

作成されたインスタンスは、可変（`var`）または読み取り専用（`val`）の[変数](basic-syntax.md#variables)に代入できます。

```kotlin
// デフォルト値を使用してインスタンスを作成し、可変変数に代入します
var anonymousUser = Person()

// 特定の値を渡してインスタンスを作成し、読み取り専用変数に代入します
val namedUser = Person("Joe")
```

[`main()`関数](basic-syntax.md#program-entry-point)内、他の関数内、または別のクラス内など、必要な場所ならどこでもインスタンスを作成できます。さらに、別の関数内でインスタンスを作成し、その関数を`main()`から呼び出すこともできます。

次のコードは、名前を格納するためのプロパティを持つ`Person`クラスを宣言しています。また、デフォルトコンストラクタの値と特定の値の両方でインスタンスを作成する方法も示しています。

```kotlin
// nameをデフォルト値で初期化するプライマリコンストラクタを持つクラスヘッダー
class Person(val name: String = "Sebastian")

fun main() {
    // デフォルトコンストラクタの値を使用してインスタンスを作成します
    val anonymousUser = Person()

    // 特定の値を渡してインスタンスを作成します
    val namedUser = Person("Joe")

    // インスタンスのnameプロパティにアクセスします
    println(anonymousUser.name)
    // Sebastian
    println(namedUser.name)
    // Joe
}
```
{kotlin-runnable="true" id="create-instance-of-a-class"}

> Kotlinでは、他のオブジェクト指向プログラミング言語とは異なり、クラスインスタンスを作成するときに`new`キーワードは必要ありません。
>
{style="note"}

ネストされた、インナー、および匿名インナークラスのインスタンスを作成する方法については、[ネストされたクラス](nested-classes.md)セクションを参照してください。

## コンストラクタと初期化ブロック

クラスインスタンスを作成するとき、そのコンストラクタのいずれかを呼び出します。Kotlinのクラスは、[_プライマリコンストラクタ_](#primary-constructor)と1つまたは複数の[_セカンダリコンストラクタ_](#secondary-constructors)を持つことができます。

プライマリコンストラクタは、クラスを初期化する主要な方法です。クラスヘッダーで宣言します。セカンダリコンストラクタは追加の初期化ロジックを提供します。クラス本体で宣言します。

プライマリコンストラクタとセカンダリコンストラクタはどちらもオプションですが、クラスは少なくとも1つのコンストラクタを持たなければなりません。

### プライマリコンストラクタ

プライマリコンストラクタは、[インスタンスが作成される](#creating-instances)ときに、インスタンスの初期状態を設定します。

プライマリコンストラクタを宣言するには、クラスヘッダーのクラス名の後に配置します。

```kotlin
class Person constructor(name: String) { /*...*/ }
```

プライマリコンストラクタに[アノテーション](annotations.md)や[可視性修飾子](visibility-modifiers.md#constructors)がない場合、`constructor`キーワードは省略できます。

```kotlin
class Person(name: String) { /*...*/ }
```

プライマリコンストラクタは、パラメータをプロパティとして宣言できます。読み取り専用プロパティを宣言するには引数名の前に`val`キーワードを使用し、可変プロパティには`var`キーワードを使用します。

```kotlin
class Person(val name: String, var age: Int) { /*...*/ }
```

これらのコンストラクタパラメータプロパティはインスタンスの一部として格納され、クラスの外部からアクセス可能です。

プロパティではないプライマリコンストラクタパラメータを宣言することも可能です。これらのパラメータには`val`または`var`が付かないため、インスタンスには格納されず、クラス本体内でのみ利用可能です。

```kotlin
// プロパティでもあるプライマリコンストラクタパラメータ
class PersonWithProperty(val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}

// プライマリコンストラクタパラメータのみ（プロパティとして格納されない）
class PersonWithAssignment(name: String) {
    // 後で使用できるようにプロパティに代入する必要があります
    val displayName: String = name
    
    fun greet() {
        println("Hello, $displayName")
    }
}
```

プライマリコンストラクタで宣言されたプロパティは、クラスの[メンバー関数](functions.md)からアクセス可能です。

```kotlin
// プロパティを宣言するプライマリコンストラクタを持つクラス
class Person(val name: String, var age: Int) {
    // クラスプロパティにアクセスするメンバー関数
    fun introduce(): String {
        return "Hi, I'm $name and I'm $age years old."
    }
}
```

プライマリコンストラクタでプロパティにデフォルト値を割り当てることもできます。

```kotlin
class Person(val name: String = "John", var age: Int = 30) { /*...*/ }
```

[インスタンス作成](#creating-instances)中にコンストラクタに値が渡されない場合、プロパティはデフォルト値を使用します。

```kotlin
// nameとageのデフォルト値を含むプライマリコンストラクタを持つクラス
class Person(val name: String = "John", var age: Int = 30)

fun main() {
    // デフォルト値を使用してインスタンスを作成します
    val person = Person()
    println("Name: ${person.name}, Age: ${person.age}")
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-primary-constructor"}

プライマリコンストラクタのパラメータを使用して、クラス本体で追加のクラスプロパティを直接初期化できます。

```kotlin
// nameとageのデフォルト値を含むプライマリコンストラクタを持つクラス
class Person(
    val name: String = "John",
    var age: Int = 30
) {
    // プライマリコンストラクタパラメータからdescriptionプロパティを初期化します
    val description: String = "Name: $name, Age: $age"
}

fun main() {
    // Personクラスのインスタンスを作成します
    val person = Person()
    // descriptionプロパティにアクセスします
    println(person.description)
    // Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-default-values"}

関数と同様に、コンストラクタ宣言で[末尾のカンマ](coding-conventions.md#trailing-commas)を使用できます。

```kotlin
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
) { /*...*/ }
```

### 初期化ブロック

プライマリコンストラクタはクラスを初期化し、そのプロパティを設定します。ほとんどの場合、これはシンプルなコードで処理できます。

[インスタンス作成](#creating-instances)中に、より複雑な操作を実行する必要がある場合は、そのロジックをクラス本体内の_初期化ブロック_に配置します。これらのブロックは、プライマリコンストラクタが実行されるときに実行されます。

初期化ブロックは`init`キーワードに続いて中括弧`{}`で宣言します。中括弧内に、初期化中に実行したいコードを記述します。

```kotlin
// nameとageを初期化するプライマリコンストラクタを持つクラス
class Person(val name: String, var age: Int) {
    init {
        // インスタンスが作成されると初期化ブロックが実行されます
        println("Person created: $name, age $age.")
    }
}

fun main() {
    // Personクラスのインスタンスを作成します
    Person("John", 30)
    // Person created: John, age 30.
}
```
{kotlin-runnable="true" id="class-with-initializer-block"}

必要なだけ初期化ブロック（`init {}`）を追加できます。それらは、プロパティ初期化子とともに、クラス本体に現れる順序で実行されます。

```kotlin
//sampleStart
// nameとageを初期化するプライマリコンストラクタを持つクラス
class Person(val name: String, var age: Int) {
    // 最初の初期化ブロック
    init {
        // インスタンスが作成されると最初に実行されます
        println("Person created: $name, age $age.")
    }

    // 2番目の初期化ブロック
    init {
        // 最初の初期化ブロックの後に実行されます
        if (age < 18) {
            println("$name is a minor.")
        } else {
            println("$name is an adult.")
        }
    }
}

fun main() {
    // Personクラスのインスタンスを作成します
    Person("John", 30)
    // Person created: John, age 30.
    // John is an adult.
}
//sampleEnd
```
{kotlin-runnable="true" id="class-with-second-initializer-block"}

初期化ブロックではプライマリコンストラクタのパラメータを使用できます。たとえば、上記のコードでは、最初の初期化子と2番目の初期化子がプライマリコンストラクタの`name`と`age`パラメータを使用しています。

`init`ブロックの一般的なユースケースはデータ検証です。たとえば、[`require`関数](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/require.html)を呼び出すことによって使用されます。

```kotlin
class Person(val age: Int) {
    init {
        require(age > 0, "age must be positive")
    }
}
```

### セカンダリコンストラクタ

Kotlinでは、セカンダリコンストラクタは、クラスがプライマリコンストラクタに加えて持つことができる追加のコンストラクタです。セカンダリコンストラクタは、クラスを初期化する複数の方法が必要な場合や、[Javaとの相互運用性](java-to-kotlin-interop.md)のために役立ちます。

セカンダリコンストラクタを宣言するには、クラス本体内で`constructor`キーワードを使用し、括弧`()`内にコンストラクタパラメータを記述します。中括弧`{}`内にコンストラクタロジックを追加します。

```kotlin
// nameとageを初期化するプライマリコンストラクタを持つクラスヘッダー
class Person(val name: String, var age: Int) {

    // ageをStringとして受け取り、Intに変換するセカンダリコンストラクタ
    constructor(name: String, age: String) : this(name, age.toIntOrNull() ?: 0) {
        println("$name created with converted age: $age")
    }
}

fun main() {
    // ageをStringとして持つセカンダリコンストラクタを使用します
    Person("Bob", "8")
    // Bob created with converted age: 8
}
```
{kotlin-runnable="true" id="class-with-secondary-constructor"}

> `age.toIntOrNull() ?: 0`という式はエルビス演算子を使用しています。詳細については、[Null安全性](null-safety.md#elvis-operator)を参照してください。
>
{style="tip"}

上記のコードでは、セカンダリコンストラクタは`this`キーワードを介してプライマリコンストラクタに委譲し、`name`と整数に変換された`age`の値を渡しています。

Kotlinでは、セカンダリコンストラクタはプライマリコンストラクタに委譲する必要があります。この委譲により、すべてのプライマリコンストラクタの初期化ロジックが、セカンダリコンストラクタのロジックが実行される前に確実に実行されます。

コンストラクタの委譲には次の種類があります。
*   **直接的**：セカンダリコンストラクタがプライマリコンストラクタを直接呼び出す場合。
*   **間接的**：あるセカンダリコンストラクタが別のコンストラクタを呼び出し、それがプライマリコンストラクタに委譲する場合。

直接的および間接的な委譲がどのように機能するかを示す例です。

```kotlin
// nameとageを初期化するプライマリコンストラクタを持つクラスヘッダー
class Person(
    val name: String,
    var age: Int
) {
    // プライマリコンストラクタへの直接的な委譲を持つセカンダリコンストラクタ
    constructor(name: String) : this(name, 0) {
        println("Person created with default age: $age and name: $name.")
    }

    // 間接的な委譲を持つセカンダリコンストラクタ:
    // this("Bob") -> constructor(name: String) -> プライマリコンストラクタ
    constructor() : this("Bob") {
        println("New person created with default age: $age and name: $name.")
    }
}

fun main() {
    // 直接的な委譲に基づいてインスタンスを作成します
    Person("Alice")
    // Person created with default age: 0 and name: Alice.

    // 間接的な委譲に基づいてインスタンスを作成します
    Person()
    // Person created with default age: 0 and name: Bob.
    // New person created with default age: 0 and name: Bob.
}
```
{kotlin-runnable="true" id="class-delegation"}

初期化ブロック（`init {}`）を持つクラスでは、これらのブロック内のコードはプライマリコンストラクタの一部になります。セカンダリコンストラクタがまずプライマリコンストラクタに委譲することを考えると、すべての初期化ブロックとプロパティ初期化子は、セカンダリコンストラクタの本体の前に実行されます。クラスにプライマリコンストラクタがない場合でも、委譲は暗黙的に発生します。

```kotlin
// プライマリコンストラクタのないクラスヘッダー
class Person {
    // インスタンスが作成されると初期化ブロックが実行されます
    init {
        // セカンダリコンストラクタの前に実行されます
        println("1. First initializer block runs")
    }

    // 整数パラメータを受け取るセカンダリコンストラクタ
    constructor(i: Int) {
        // 初期化ブロックの後に実行されます
        println("2. Person $i is created")
    }
}

fun main() {
    // Personクラスのインスタンスを作成します
    Person(1)
    // 1. First initializer block runs
    // 2. Person 1 created
}
```
{kotlin-runnable="true" id="class-delegation-sequence"}

### コンストラクタのないクラス

いずれのコンストラクタ（プライマリまたはセカンダリ）も宣言しないクラスは、パラメータのない暗黙のプライマリコンストラクタを持ちます。

```kotlin
// 明示的なコンストラクタのないクラス
class Person {
    // プライマリコンストラクタもセカンダリコンストラクタも宣言されていません
}

fun main() {
    // 暗黙のプライマリコンストラクタを使用して
    // Personクラスのインスタンスを作成します
    val person = Person()
}
```

この暗黙のプライマリコンストラクタの可視性は`public`であり、どこからでもアクセスできることを意味します。クラスに`public`なコンストラクタを持たせたくない場合は、デフォルト以外の可視性を持つ空のプライマリコンストラクタを宣言します。

```kotlin
class Person private constructor() { /*...*/ }
```

> JVM上では、すべてのプライマリコンストラクタパラメータがデフォルト値を持つ場合、コンパイラはそれらのデフォルト値を使用する引数なしコンストラクタを暗黙的に提供します。
>
> これにより、[Jackson](https://github.com/FasterXML/jackson)や[Spring Data JPA](https://spring.io/projects/spring-data-jpa)のような、引数なしコンストラクタを介してクラスインスタンスを作成するライブラリとKotlinをより簡単に使用できるようになります。
>
> 次の例では、Kotlinはデフォルト値`""`を使用する引数なしコンストラクタ`Person()`を暗黙的に提供します。
>
> ```kotlin
> class Person(val personName: String = "")
> ```
>
{style="note"}

## 継承

Kotlinにおけるクラス継承は、既存のクラス（基底クラス）から新しいクラス（派生クラス）を作成することを可能にし、振る舞いを追加または変更しながら、そのプロパティと関数を継承します。

継承階層と`open`キーワードの使用方法に関する詳細については、[継承](inheritance.md)セクションを参照してください。

## 抽象クラス

Kotlinでは、抽象クラスは直接インスタンス化できないクラスです。それらは、実際の振る舞いを定義する他のクラスに継承されるように設計されています。この振る舞いは_実装_と呼ばれます。

抽象クラスは、抽象プロパティと関数を宣言でき、これらはサブクラスによって実装されなければなりません。

抽象クラスはコンストラクタを持つこともできます。これらのコンストラクタはクラスプロパティを初期化し、サブクラスに必要なパラメータを強制します。`abstract`キーワードを使用して抽象クラスを宣言します。

```kotlin
abstract class Person(val name: String, val age: Int)
```

抽象クラスは、抽象メンバーと非抽象メンバー（プロパティと関数）の両方を持つことができます。メンバーを抽象として宣言するには、`abstract`キーワードを明示的に使用する必要があります。

抽象クラスや関数は、デフォルトで暗黙的に継承可能であるため、`open`キーワードでアノテーションする必要はありません。`open`キーワードの詳細については、[継承](inheritance.md#open-keyword)を参照してください。

抽象メンバーは抽象クラスで実装を持ちません。実装は、`override`関数またはプロパティを持つサブクラスまたは継承クラスで定義します。

```kotlin
// nameとageを宣言するプライマリコンストラクタを持つ抽象クラス
abstract class Person(
    val name: String,
    val age: Int
) {
    // 抽象メンバー
    // 実装は提供せず、サブクラスによって実装される必要があります
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
    // Studentクラスのインスタンスを作成します
    val student = Student("Alice", 20, "Engineering University")
    
    // 非抽象メンバーを呼び出します
    student.greet()
    // Hello, my name is Alice.
    
    // オーバーライドされた抽象メンバーを呼び出します
    student.introduce()
    // I am Alice, 20 years old, and I study at Engineering University.
}
```
{kotlin-runnable="true" id="abstract-class"}

## コンパニオンオブジェクト

Kotlinでは、各クラスは[コンパニオンオブジェクト](object-declarations.md#companion-objects)を持つことができます。コンパニオンオブジェクトは、クラスインスタンスを作成せずにクラス名を使用してそのメンバーにアクセスできるオブジェクト宣言の一種です。

クラスのインスタンスを作成せずに呼び出すことができ、かつ論理的にはそのクラスに接続されている関数（ファクトリ関数など）を記述する必要があるとします。その場合、クラス内のコンパニオン[オブジェクト宣言](object-declarations.md)内にそれを宣言できます。

```kotlin
// nameプロパティを宣言するプライマリコンストラクタを持つクラス
class Person(
    val name: String
) {
    // コンパニオンオブジェクトを持つクラス本体
    companion object {
        fun createAnonymous() = Person("Anonymous")
    }
}

fun main() {
    // クラスのインスタンスを作成せずに関数を呼び出します
    val anonymous = Person.createAnonymous()
    println(anonymous.name)
    // Anonymous
}
```
{kotlin-runnable="true" id="class-with-companion-object"}

クラス内にコンパニオンオブジェクトを宣言した場合、クラス名を修飾子としてのみ使用してそのメンバーにアクセスできます。

詳細については、[コンパニオンオブジェクト](object-declarations.md#companion-objects)を参照してください。