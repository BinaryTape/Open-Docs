---
title: コーディング規約
---
一般的に知られており、従いやすいコーディング規約は、あらゆるプログラミング言語にとって不可欠です。
ここでは、Kotlin を使用するプロジェクトのコードスタイルとコード構成に関するガイドラインを提供します。

## IDE でのスタイルの設定

Kotlin で最も人気のある 2 つの IDE である[IntelliJ IDEA](https://www.jetbrains.com/idea/)と[Android Studio](https://developer.android.com/studio/)は、
コードスタイリングを強力にサポートしています。与えられたコードスタイルに合わせてコードを自動的に整形するように設定できます。
 
### スタイルガイドの適用

1. **Settings/Preferences | Editor | Code Style | Kotlin** に移動します。
2. **Set from...** をクリックします。
3. **Kotlin style guide** を選択します。

### コードがスタイルガイドに従っていることを確認する

1. **Settings/Preferences | Editor | Inspections | General** に移動します。
2. **Incorrect formatting** インスペクションをオンにします。
スタイルガイドに記述されている他の問題（命名規則など）を検証する追加のインスペクションは、デフォルトで有効になっています。

## ソースコードの構成

### ディレクトリ構造

純粋な Kotlin プロジェクトでは、推奨されるディレクトリ構造は、共通のルートパッケージを省略したパッケージ構造に従います。たとえば、プロジェクト内のすべてのコードが `org.example.kotlin` パッケージとそのサブパッケージにある場合、`org.example.kotlin` パッケージのファイルはソースルート直下に配置し、`org.example.kotlin.network.socket` のファイルはソースルートの `network/socket` サブディレクトリに配置する必要があります。

:::note
JVM 上: Kotlin が Java と共に使用されるプロジェクトでは、Kotlin ソースファイルは Java ソースファイルと同じソースルートに存在し、同じディレクトリ構造に従う必要があります。各ファイルは、各パッケージステートメントに対応するディレクトリに保存する必要があります。

:::

### ソースファイル名

Kotlin ファイルに単一のクラスまたはインターフェース（関連するトップレベルの宣言を含む可能性がある）が含まれている場合、その名前はクラスの名前と同じにし、`.kt` 拡張子を付加する必要があります。これは、すべてのタイプのクラスとインターフェースに適用されます。ファイルに複数のクラスが含まれている場合、またはトップレベルの宣言のみが含まれている場合は、ファイルの内容を説明する名前を選択し、それに応じてファイルに名前を付けます。[アッパーキャメルケース](https://en.wikipedia.org/wiki/Camel_case)を使用し、各単語の最初の文字を大文字にします。たとえば、`ProcessDeclarations.kt` のようにします。

ファイルの名前は、ファイル内のコードが何をするのかを説明する必要があります。したがって、ファイル名に `Util` などの意味のない単語を使用することは避けるべきです。

#### マルチプラットフォームプロジェクト

マルチプラットフォームプロジェクトでは、プラットフォーム固有のソースセット内のトップレベルの宣言を含むファイルには、ソースセットの名前に関連付けられたサフィックスを付ける必要があります。 例:

* **jvm**Main/kotlin/Platform.**jvm**.kt
* **android**Main/kotlin/Platform.**android**.kt
* **ios**Main/kotlin/Platform.**ios**.kt

共通ソースセットの場合、トップレベルの宣言を含むファイルにはサフィックスを付けるべきではありません。たとえば、`commonMain/kotlin/Platform.kt` のようにします。

##### 技術的な詳細

JVM の制限により、マルチプラットフォームプロジェクトではこのファイル命名規則に従うことをお勧めします。トップレベルのメンバー（関数、プロパティ）は許可されていません。

これを回避するために、Kotlin JVM コンパイラーはトップレベルのメンバー宣言を含むラッパークラス（いわゆる「ファイルファサード」）を作成します。ファイルファサードには、ファイル名から派生した内部名があります。

次に、JVM は同じ完全修飾名 (FQN) を持つ複数のクラスを許可しません。これにより、Kotlin プロジェクトを JVM にコンパイルできない状況が発生する可能性があります。

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // 'fun count() { }' を含む
|- jvmMain/kotlin/myPackage/Platform.kt // 'fun multiply() { }' を含む
```

ここでは、両方の `Platform.kt` ファイルが同じパッケージにあるため、Kotlin JVM コンパイラーは 2 つのファイルファサードを生成します。これらはどちらも FQN `myPackage.PlatformKt` を持ちます。これにより、「Duplicate JVM classes」エラーが発生します。

これを回避する最も簡単な方法は、上記のガイドラインに従ってファイルの 1 つの名前を変更することです。この命名規則は、コードの可読性を維持しながら、競合を回避するのに役立ちます。

:::note
これらの推奨事項が冗長に思われるシナリオが 2 つありますが、それでも従うことをお勧めします。

* JVM 以外のプラットフォームでは、ファイルファサードの複製に問題はありません。ただし、この命名規則は、ファイル命名の一貫性を保つのに役立ちます。
* JVM 上では、ソースファイルにトップレベルの宣言がない場合、ファイルファサードは生成されず、名前の衝突は発生しません。

  ただし、この命名規則は、簡単なリファクタリング
または追加によってトップレベルの関数が含まれ、「Duplicate JVM classes」エラーが発生する可能性のある状況を回避するのに役立ちます。

### ソースファイルの構成

複数の宣言（クラス、トップレベルの関数またはプロパティ）を同じ Kotlin ソースファイルに配置することは、これらの宣言が互いに意味的に密接に関連しており、ファイルサイズが妥当な範囲内（数百行を超えない）である限り推奨されます。

特に、クラスのすべてのクライアントに関連するクラスの拡張関数を定義する場合は、そのクラス自体と同じファイルに配置します。特定のクライアントのみに意味のある拡張関数を定義する場合は、そのクライアントのコードの隣に配置します。一部のクラスのすべての拡張機能を保持するためだけにファイルを作成することは避けてください。

### クラスのレイアウト

クラスの内容は、次の順序で配置する必要があります。

1. プロパティの宣言とイニシャライザブロック
2. セカンダリコンストラクタ
3. メソッドの宣言
4. コンパニオンオブジェクト

メソッドの宣言をアルファベット順または可視性で並べ替えたり、通常メソッドを拡張メソッドから分離したりしないでください。代わりに、関連するものをまとめて配置することで、クラスを上から下に読んでいる人が何が起こっているのかのロジックを追うことができます。順序を選択し（上位のものを最初にするか、その逆）、それを守ってください。

ネストされたクラスは、それらのクラスを使用するコードの隣に配置します。クラスが外部で使用されることを目的としており、クラス内で参照されていない場合は、コンパニオンオブジェクトの後に、最後に配置します。

### インターフェース実装のレイアウト

インターフェースを実装する場合は、インターフェースのメンバーと同じ順序で実装メンバーを保持します（必要に応じて、実装に使用される追加のプライベートメソッドを挟みます）。

### オーバーロードのレイアウト

クラス内でオーバーロードを常に互いに隣接させて配置します。

## 命名規則

Kotlin のパッケージ名とクラス名の規則は非常に簡単です。

* パッケージ名は常に小文字で、アンダースコアは使用しません (`org.example.project`)。複数単語の名前の使用は一般的に推奨されませんが、複数の単語を使用する必要がある場合は、それらを単に連結するか、キャメルケースを使用できます (`org.example.myProject`)。

* クラス名とオブジェクト名は、アッパーキャメルケースを使用します。

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 関数名
 
関数、プロパティ、およびローカル変数の名前は、小文字で始まり、アンダースコアなしのキャメルケースを使用します。

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

例外：クラスのインスタンスを作成するために使用されるファクトリ関数は、抽象的な戻り値の型と同じ名前を持つことができます。

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### テストメソッドの名前

テストでは（そして **テストでのみ** ）、バッククォートで囲まれたスペースを含むメソッド名を使用できます。
このようなメソッド名は、API レベル 30 以降の Android ランタイムでのみサポートされていることに注意してください。アンダースコア
メソッド名もテストコードで許可されています。

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }
     
     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### プロパティ名

定数（`const` でマークされたプロパティ、またはカスタムの `get` 関数を持たないトップレベルまたはオブジェクトの `val` プロパティで、深く不変のデータを保持するプロパティ）の名前はすべて大文字で、アンダースコアで区切られた名前を、([ス**screaming snake case**](https://en.wikipedia.org/wiki/Snake_case))
慣習に従って使用する必要があります。

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

動作または可変データを持つオブジェクトを保持するトップレベルまたはオブジェクトのプロパティの名前は、キャメルケースの名前を使用する必要があります。

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

シングルトンオブジェクトへの参照を保持するプロパティの名前は、`object` 宣言と同じ命名スタイルを使用できます。

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

列挙型定数の場合、([ス**screaming snake case**](https://en.wikipedia.org/wiki/Snake_case)) 名 (`enum class Color { RED, GREEN }`) またはアッパーキャメルケース名を使用できます。これは使用状況によって異なります。
   
### バッキングプロパティの名前

クラスに概念的に同じであるが、一方がパブリック API の一部であり、もう一方が実装の詳細である 2 つのプロパティがある場合は、プライベートプロパティの名前のプレフィックスとしてアンダースコアを使用します。

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 適切な名前を選択する

クラスの名前は通常、クラスが _何であるか_ を説明する名詞または名詞句です。`List`、`PersonReader`。

メソッドの名前は通常、メソッドが _何をするか_ を表す動詞または動詞句です。`close`、`readPersons`。
名前はまた、メソッドがオブジェクトを変更しているのか、それとも新しいオブジェクトを返しているのかを示す必要があります。たとえば、`sort` は
コレクションをその場でソートしますが、`sorted` はコレクションのソートされたコピーを返します。

名前はエンティティの目的を明確にする必要があるため、名前で意味のない単語 (`Manager`、`Wrapper`) を使用することは避けるのが最善です。

宣言名の一部として頭字語を使用する場合は、次の規則に従ってください。

* 2 文字の頭字語の場合は、両方の文字に大文字を使用します。たとえば、`IOStream`。
* 3 文字以上の頭字語の場合は、最初の文字のみを大文字にします。たとえば、`XmlFormatter` または `HttpInputStream`。

## フォーマット

### インデント

インデントには 4 つのスペースを使用します。タブは使用しないでください。

中括弧の場合、構成が始まる行の最後に開始中括弧を配置し、終了中括弧を
開始構成と水平に揃えられた別の行に配置します。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

Kotlin では、セミコロンはオプションであるため、改行は重要です。言語設計は
Java スタイルの括弧を想定しており、異なるフォーマットスタイルを使用しようとすると、驚くべき動作が発生する可能性があります。

:::

### 水平方向の空白

* 二項演算子の周囲にスペースを入れます (`a + b`)。例外: "range to" 演算子の周囲にはスペースを入れないでください (`0..i`)。
* 単項演算子の周囲にスペースを入れないでください (`a++`)。
* 制御フローキーワード (`if`、`when`、`for`、および `while`) と対応する開始括弧の間にスペースを入れます。
* プライマリコンストラクタ宣言、メソッド宣言、またはメソッド呼び出しで、開始括弧の前にスペースを入れないでください。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

* `(`、`[` の後、または `]`、`)` の前にスペースを入れないでください。
* `.` または `?.` の周囲にスペースを入れないでください: `foo.bar().filter { it > 2 }.joinToString()`、`foo?.bar()`。
* `//` の後にスペースを入れます: `// これはコメントです`。
* 型パラメータを指定するために使用される山括弧の周囲にスペースを入れないでください: `class Map<K, V> { ... }`。
* `::` の周囲にスペースを入れないでください: `Foo::class`、`String::length`。
* nullable 型を示すために使用される `?` の前にスペースを入れないでください: `String?`。

一般的な規則として、あらゆる種類の水平方向の配置を避けてください。識別子の名前を長さが異なる名前に変更しても、宣言または使用法のフォーマットに影響を与えないようにする必要があります。

### コロン

次のシナリオでは、`:` の前にスペースを入れます。

* 型とスーパタイプを区切るために使用する場合。
* スーパークラスコンストラクタまたは同じクラスの別のコンストラクタに委譲する場合。
* `object` キーワードの後。
    
宣言とその型を区切る場合は、`:` の前にスペースを入れないでください。
 
常に `:` の後にスペースを入れます。

```kotlin
abstract class Foo<out T : Any> : IFoo {
    abstract fun foo(a: Int): T
}

class FooImpl : Foo() {
    constructor(x: String) : this(x) { /*...*/ }
    
    val x = object : IFoo { /*...*/ } 
} 
```

### クラスヘッダー

いくつかのプライマリコンストラクタパラメータを持つクラスは、1 行で記述できます。

```kotlin
class Person(id: Int, name: String)
```

長いヘッダーを持つクラスは、各プライマリコンストラクタパラメータがインデントされた別の行になるようにフォーマットする必要があります。
また、閉じ括弧は新しい行に配置する必要があります。継承を使用する場合は、スーパークラスコンストラクタ呼び出し、または
実装されたインターフェースのリストは、括弧と同じ行に配置する必要があります。

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

複数のインターフェースの場合、スーパークラスコンストラクタ呼び出しを最初に配置し、各インターフェースを
別の行に配置する必要があります。

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

長いスーパタイプリストを持つクラスの場合、コロンの後に改行を入れ、すべてのスーパタイプ名を水平に配置します。

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

クラスヘッダーが長い場合にクラスヘッダーと本文を明確に区切るには、クラスヘッダーの後に空白行を配置するか（上記の例のように）、開始中括弧を別の行に配置します。

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

コンストラクタパラメータには、通常のインデント（4 つのスペース）を使用します。これにより、プライマリコンストラクタで宣言されたプロパティが、クラスの本文で宣言されたプロパティと同じインデントを持つことが保証されます。

### 修飾子の順序

宣言に複数の修飾子がある場合は、常に次の順序で配置します。

```kotlin
public / protected / private / internal
expect / actual
final / open / abstract / sealed / const
external
override
lateinit
tailrec
vararg
suspend
inner
enum / annotation / fun // `fun interface` の修飾子として
companion
inline / value
infix
operator
data
```

すべての注釈を修飾子の前に配置します。

```kotlin
@Named("Foo")
private val foo: Foo
```

ライブラリで作業している場合を除き、冗長な修飾子（たとえば、`public`）は省略します。

### アノテーション

アノテーションをアタッチ先の宣言の前の別の行に、同じインデントで配置します。

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

引数のないアノテーションは、同じ行に配置できます。

```kotlin
@JsonExclude @JvmField
var x: String
```

引数のない単一のアノテーションは、対応する宣言と同じ行に配置できます。

```kotlin
@Test fun foo() { /*...*/ }
```

### ファイルアノテーション

ファイルアノテーションは、ファイルコメント（存在する場合）の後、`package` ステートメントの前に配置され、`package` とは空白行で区切られます（これらがパッケージではなくファイルを対象としていることを強調するため）。

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 関数

関数のシグネチャが 1 行に収まらない場合は、次の構文を使用します。

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

関数のパラメータには、通常のインデント（4 つのスペース）を使用します。これにより、コンストラクタパラメータとの一貫性が確保されます。

本文が単一の式で構成される関数には、式本文を使用することをお勧めします。

```kotlin
fun foo(): Int {     // 良くない
    return 1 
}

fun foo() = 1        // 良い
```

### 式本文

関数の式本文の最初の行が宣言と同じ行に収まらない場合は、`=` 記号を最初の行に配置し、式本文を 4 つのスペースでインデントします。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### プロパティ

非常に単純な読み取り専用プロパティの場合は、1 行のフォーマットを検討してください。

```kotlin
val isEmpty: Boolean get() = size == 0
```

より複雑なプロパティの場合は、常に `get` および `set` キーワードを別の行に配置します。

```kotlin
val foo: String
    get() { /*...*/ }
```

イニシャライザを持つプロパティの場合、イニシャライザが長い場合は、`=` 記号の後に改行を追加し、イニシャライザを 4 つのスペースでインデントします。

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 制御フロー文

`if` または `when` ステートメントの条件が複数行にわたる場合は、常にステートメントの本文を中括弧で囲みます。
条件の後続の各行を、ステートメントの開始位置から相対的に 4 つのスペースでインデントします。
条件の閉じ括弧を、開始中括弧と一緒に別の行に配置します。

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

これにより、条件とステートメントの本文が整列されます。

`else`、`catch`、`finally` キーワード、および `do-while` ループの `while` キーワードを、先行する中括弧と同じ行に配置します。

```kotlin
if (condition) {
    // body
} else {
    // else part
}

try {
    // body
} finally {
    // cleanup
}
```

`when` ステートメントでは、ブランチが複数行にわたる場合は、空白行で隣接する case ブロックから分離することを検討してください。

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken `->`
            callback.visitValue(propName, token.value)

        Token.LBRACE `->` { // ...
        }
    }
}
```

短いブランチは、中括弧なしで条件と同じ行に配置します。

```kotlin
when (foo) {
    true `->` bar() // 良い
    false `->` { baz() } // 良くない
}
```

### メソッド呼び出し

長い引数リストでは、開始括弧の後に改行を入れます。引数を 4 つのスペースでインデントします。
密接に関連する複数の引数を同じ行にグループ化します。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

引数名と値を区切る `=` 記号の周囲にスペースを入れます。

### チェーンされた呼び出しの折り返し

チェーンされた呼び出しを折り返す場合は、`.` 文字または `?.` 演算子を次の行に、単一のインデントで配置します。

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

チェーン内の最初の呼び出しは通常、その前に改行が入りますが、コードがそのように記述した方が意味が通じる場合は、省略してもかまいません。

### ラムダ

ラムダ式では、中括弧の周囲、およびパラメータから本文を区切る矢印の周囲にスペースを使用する必要があります。呼び出しが単一のラムダを受け取る場合は、可能な限り括弧の外に渡します。

```kotlin
list.filter { it > 10 }
```

ラムダにラベルを割り当てる場合は、ラベルと開始中括弧の間にスペースを入れないでください。

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

複数行のラムダでパラメータ名を宣言する場合は、名前を最初の行に配置し、その後に矢印と改行を配置します。

```kotlin
appendCommaSeparated(properties) { prop `->`
    val propertyValue = prop.get(obj)  // ...
}
```

パラメータリストが長すぎて 1 行に収まらない場合は、矢印を別の行に配置します。

```kotlin
foo {
   context: Context,
   environment: Env
   `->`
   context.configureEnv(environment)
}
```

### 末尾のコンマ

末尾のコンマは、要素のシリーズの最後の項目の後のコンマ記号です。

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // 末尾のコンマ
)
```

末尾のコンマを使用すると、いくつかの利点があります。

* バージョン管理の差分がよりクリーンになります。すべての焦点が変更された値に当てられます。
* 要素の追加と並べ替えが簡単になります。要素を操作する場合にコンマを追加または削除する必要はありません。
* たとえば、オブジェクトイニシャライザの場合、コード生成が簡素化されます。最後の要素にもコンマを含めることができます。

末尾のコンマは完全にオプションです。なくてもコードは引き続き動作します。Kotlin スタイルガイドでは、宣言サイトでの末尾のコンマの使用が推奨されており、呼び出しサイトではユーザーの判断に任されています。

IntelliJ IDEA フォーマッタで末尾のコンマを有効にするには、**Settings/Preferences | Editor | Code Style | Kotlin** に移動し、
**Other** タブを開き、**Use trailing comma** オプションを選択します。

#### 列挙型

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // 末尾のコンマ
}
```

#### 値引数

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // 末尾のコンマ
)
val colors = listOf(
    "red",
    "green",
    "blue", // 末尾のコンマ
)
```

#### クラスのプロパティとパラメータ

```kotlin
class Customer(
    val name: String,
    val lastName: String, // 末尾のコンマ
)
class Customer(
    val name: String,
    lastName: String, // 末尾のコンマ
)
```

#### 関数の値パラメータ

```kotlin
fun powerOf(
    number: Int, 
    exponent: Int, // 末尾のコンマ
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // 末尾のコンマ
) {}
fun print(
    vararg quantity: Int,
    description: String, // 末尾のコンマ
) {}
```

#### オプションの型を持つパラメータ (セッターを含む)

```kotlin
val sum: (Int, Int, Int) `->` Int = fun(
    x,
    y,
    z, // 末尾のコンマ
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### インデックス付けのサフィックス

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // 末尾のコンマ
    ]
```

#### ラムダのパラメータ

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // 末尾のコンマ
        `->`
        println("1")
    }
    println(x)
}
```

#### when エントリ

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // 末尾のコンマ
        `->` true
    else `->` false
}
```

#### コレクションリテラル (アノテーション内)

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // 末尾のコンマ
])
fun run() {}
```

#### 型引数

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // 末尾のコンマ
            >()
}
```

#### 型パラメータ

```kotlin
class MyMap<
        MyKey,
        MyValue, // 末尾のコンマ
        > {}
```

#### 分割宣言

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // 末尾のコンマ
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // 末尾のコンマ
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## ドキュメンテーションコメント

長いドキュメンテーションコメントの場合は、開始 `/**` を別の行に配置し、後続の各行を
アスタリスクで始めます。

```kotlin
/**
 * これは、複数行にわたる
 * ドキュメンテーションコメントです。
 */
```

短いコメントは、1 行に配置できます。

```kotlin
/** これは短いドキュメンテーションコメントです。 */
```

一般に、`@param` および `@return` タグの使用は避けてください。代わりに、パラメータと戻り値の説明を
ドキュメンテーションコメントに直接組み込み、パラメータが言及されている場所にはリンクを追加します。`@param` および
`@return` は、メインテキストの流れに収まらない長い説明が必要な場合にのみ使用します。

```kotlin
// これを行うことは避けてください。

/**
 * 指定された数値の絶対値を返します。
 * @param number 絶対値を返す数値。
 * @return 絶対値。
 */
fun abs(number: Int): Int { /*...*/ }

// 代わりに、これを行ってください。

/**
 * 指定された [number] の絶対値を返します。
 */
fun abs(number: Int): Int { /*...*/ }
```

## 冗長な構文を避ける

一般に、Kotlin の特定の構文構成がオプションであり、IDE によって
冗長として強調表示されている場合は、コードで省略する必要があります。単に「明確にするため」だけに、不要な構文要素をコードに残さないでください。

### Unit 戻り値の型

関数が Unit を返す場合、戻り値の型は省略する必要があります。

```kotlin
fun foo() { // ここでは ": Unit" が省略されています

}
```

### セミコロン

可能な限り、セミコロンは省略します。

### 文字列テンプレート

単純な変数を文字列テンプレートに挿入するときは、中括弧を使用しないでください。より長い式の場合にのみ中括弧を使用します。

```kotlin
println("$name has ${children.size} children")
```

## 言語機能の慣用的な使用法

### 不変性

可変データよりも不変データを使用することを好みます。初期化後に変更されない場合は、ローカル変数とプロパティを `var` ではなく `val` として常に宣言します。

コレクションを宣言するときは、常に不変のコレクションインターフェース (`Collection`、`List`、`Set`、`Map`) を使用してください。
コレクションインスタンスを作成するためにファクトリ関数を使用する場合は、可能な限り不変の
コレクション型を返す関数を常に使用してください。

```kotlin
// 良くない: 可変コレクション型を、変更されない値に使用しています。
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// 良い: 代わりに不変のコレクション型を使用しています。
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// 良くない: arrayListOf() は、可変コレクション型である ArrayList<T> を返します。
val allowedValues = arrayListOf("a", "b", "c")

// 良い: listOf() は List<T> を返します。
val allowedValues = listOf("a", "b", "c")
```

### デフォルトのパラメータ値

オーバーロードされた関数を宣言するよりも、デフォルトのパラメータ値を持つ関数を宣言することを好みます。

```kotlin
// 良くない
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// 良い
fun foo(a: String = "a") { /*...*/ }
```

### 型エイリアス

コードベースで複数回使用される関数型または型パラメータを持つ型がある場合は、
その型に対して型エイリアスを定義することを好みます。

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) `->` Unit
typealias PersonIndex = Map<String, Person>
```
名前の衝突を避けるためにプライベートまたは内部の型エイリアスを使用する場合は、[パッケージとインポート](packages) で説明されている `import ... as ...` を好みます。

### ラムダパラメータ

短いネストされていないラムダでは、パラメータを
明示的に宣言する代わりに、`it` 規約を使用することをお勧めします。パラメータを持つネストされたラムダでは、常にパラメータを明示的に宣言します。

### ラムダでの戻り値

ラムダで複数のラベル付き return を使用することは避けてください。ラムダを再構築して、単一の終了点を持つようにすることを検討してください。
それが不可能な場合、または十分に明確でない場合は、ラムダを匿名関数に変換することを検討してください。

ラムダ内の最後のステートメントには、ラベル付き return を使用しないでください。

### 名前付き引数

メソッドが同じプリミティブ型の複数のパラメータを取る場合、または `Boolean` 型のパラメータの場合は、名前付き引数構文を使用します。
ただし、すべてのパラメータの意味がコンテキストから完全に明確である場合は除きます。

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 条件文

`try`、`if`、および `when` の式形式を使用することを好みます。

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 `->` "zero"
    else `->` "nonzero"
}
```

上記は、以下よりも推奨されます。

```kotlin
if (x)
    return foo()
else
    return bar()
```

```kotlin
when(x) {
    0 `->` return "zero"
    else `->` return "nonzero"
}    
```

### if 対 when

2 項条件の場合は、`when` ではなく `if` を使用することを好みます。
たとえば、`if` では次の構文を使用します。

```kotlin
if (x == null) ... else ...
```

`when` では次の構文の代わりにこれを使用します。

```kotlin
when (x) {
    null `->` // ...
    else `->` // ...
}
```

オプションが 3 つ以上ある場合は、`when` を使用することを好みます。

### when 式のガード条件

[ガード条件](control-flow#ガード条件付きのwhen-式)を含む `when` 式またはステートメントで複数のブール式を組み合わせる場合は、括弧を使用します。

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty() || status.info.id == null) `->` "no information"
}
```

以下の代わりにこれを使用します。

```kotlin
when (status) {
    is Status.Ok if status.info.isEmpty() || status.info.id == null `->` "no information"
}
```

### 条件内の Nullable Boolean 値

条件文で nullable `Boolean` を使用する必要がある場合は、`if (value == true)` または `if (value == false)` チェックを使用します。

### ループ

ループよりも高階関数 (`filter`、`map` など) を使用することを好みます。例外: `forEach` (レシーバが nullable であるか、`forEach` がより長い呼び出しチェーンの一部として使用されている場合を除き、通常の `for` ループを代わりに使用することを好みます)。

複数の高階関数を使用する複雑な式とループのどちらを選択するかを決めるときは