[//]: # (title: コーディング規約)

広く知られ、従いやすいコーディング規約は、あらゆるプログラミング言語にとって不可欠です。
ここでは、Kotlinを使用するプロジェクトのコードスタイルとコード構成に関するガイドラインを提供します。

## IDEでスタイルを設定する

Kotlinで最も人気のある2つのIDEである[IntelliJ IDEA](https://www.jetbrains.com/idea/)と[Android Studio](https://developer.android.com/studio/)は、
コードスタイルの強力なサポートを提供します。これらを構成して、指定されたコードスタイルに合わせてコードを自動的にフォーマットできます。

### スタイルガイドを適用する

1.  **Settings/Preferences | Editor | Code Style | Kotlin** に移動します。
2.  **Set from...** をクリックします。
3.  **Kotlin style guide** を選択します。

### コードがスタイルガイドに従っているか検証する

1.  **Settings/Preferences | Editor | Inspections | General** に移動します。
2.  **Incorrect formatting** インスペクションをオンにします。
スタイルガイドで記述されている他の問題（命名規則など）を検証する追加のインスペクションは、デフォルトで有効になっています。

## ソースコードの構成

### ディレクトリ構造

純粋なKotlinプロジェクトでは、推奨されるディレクトリ構造は、共通のルートパッケージを省略したパッケージ構造に従います。
例えば、プロジェクト内のすべてのコードが`org.example.kotlin`パッケージとそのサブパッケージにある場合、`org.example.kotlin`パッケージを持つファイルはソースルート直下に配置され、
`org.example.kotlin.network.socket`にあるファイルはソースルートの`network/socket`サブディレクトリに配置されます。

>JVM上: KotlinがJavaと一緒に使用されるプロジェクトでは、KotlinソースファイルはJavaソースファイルと同じソースルートに配置し、
>同じディレクトリ構造に従うべきです。各ファイルは、それぞれのパッケージステートメントに対応するディレクトリに格納されるべきです。
>
{style="note"}

### ソースファイル名

Kotlinファイルが単一のクラスまたはインターフェース（関連するトップレベル宣言を含む可能性がある）を含む場合、そのファイル名はクラス名と同じで、`.kt`拡張子が付加されるべきです。これはあらゆる種類のクラスとインターフェースに適用されます。
ファイルが複数のクラス、またはトップレベル宣言のみを含む場合、ファイルに含まれる内容を記述する名前を選択し、それに応じてファイルに名前を付けます。
各単語の最初の文字が大文字になる[アッパーキャメルケース](https://en.wikipedia.org/wiki/Camel_case)を使用してください。
例えば、`ProcessDeclarations.kt`のようになります。

ファイル名はファイル内のコードが何をするのかを記述するべきです。そのため、ファイル名に`Util`のような意味のない単語を使用することは避けるべきです。

#### マルチプラットフォームプロジェクト

マルチプラットフォームプロジェクトでは、プラットフォーム固有のソースセット内のトップレベル宣言を持つファイルには、
ソースセットの名前に関連付けられたサフィックスを付ける必要があります。例:

*   **jvm**Main/kotlin/Platform.**jvm**.kt
*   **android**Main/kotlin/Platform.**android**.kt
*   **ios**Main/kotlin/Platform.**ios**.kt

共通ソースセットに関しては、トップレベル宣言を持つファイルにはサフィックスを付けるべきではありません。例えば、`commonMain/kotlin/Platform.kt`のようになります。

##### 技術的詳細 {initial-collapse-state="collapsed" collapsible="true"}

JVMの制限により、マルチプラットフォームプロジェクトではこのファイル命名規則に従うことを推奨します。JVMは
トップレベルのメンバー（関数、プロパティ）を許可しません。

これを回避するために、Kotlin JVMコンパイラは、トップレベルメンバー宣言を含むラッパークラス（いわゆる「ファイルファサード」）を作成します。
ファイルファサードは、ファイル名から派生した内部名を持ちます。

その結果、JVMは同じ完全修飾名（FQN）を持つ複数のクラスを許可しません。これにより、
KotlinプロジェクトがJVMにコンパイルできない状況が発生する可能性があります。

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

ここでは、両方の`Platform.kt`ファイルが同じパッケージにあるため、Kotlin JVMコンパイラは2つのファイルファサードを生成し、
どちらもFQNが`myPackage.PlatformKt`になります。これにより、「Duplicate JVM classes (JVMクラスの重複)」エラーが発生します。

これを回避する最も簡単な方法は、上記ガイドラインに従ってファイルの1つをリネームすることです。この命名規則は、
コードの可読性を維持しながら、衝突を回避するのに役立ちます。

> これらの推奨事項が冗長に思える2つのシナリオがありますが、それでも従うことをお勧めします。
>
> *   非JVMプラットフォームでは、ファイルファサードの重複に関する問題はありません。ただし、この命名規則は
>     ファイル命名の一貫性を保つのに役立ちます。
> *   JVM上では、ソースファイルにトップレベル宣言がない場合、ファイルファサードは生成されず、
>     命名の衝突に直面することはありません。
>
>     しかし、この命名規則は、単純なリファクタリングや追加によってトップレベル関数が
>     含まれ、「Duplicate JVM classes (JVMクラスの重複)」エラーが発生するような状況を回避するのに役立ちます。
>
{style="tip"}

### ソースファイルの構成

複数の宣言（クラス、トップレベル関数、プロパティ）を同じKotlinソースファイルに配置することは、
これらの宣言が意味的に互いに密接に関連しており、ファイルサイズが妥当な範囲内（数百行を超えない）であれば推奨されます。

特に、あるクラスのすべてのクライアントに関連するそのクラスの拡張関数を定義する場合は、
そのクラスと同じファイルに配置してください。特定のクライアントにのみ意味のある拡張関数を定義する場合は、
そのクライアントのコードの隣に配置してください。あるクラスのすべての拡張を保持するためだけにファイルを作成することは避けてください。

### クラスのレイアウト

クラスの内容は以下の順序で配置すべきです。

1.  プロパティ宣言と初期化ブロック
2.  セカンダリコンストラクタ
3.  メソッド宣言
4.  コンパニオンオブジェクト

メソッド宣言をアルファベット順や可視性順に並べたり、通常のメソッドと拡張メソッドを分離したりしないでください。
代わりに、関連するものをまとめて配置し、クラスを上から下へ読む人が何が起こっているかのロジックを追えるようにしてください。
（高レベルのものを最初にするか、その逆にするか）順序を選択し、それに従ってください。

ネストされたクラスは、それらのクラスを使用するコードの隣に配置してください。クラスが外部で使用されることを意図しており、
クラス内で参照されていない場合は、コンパニオンオブジェクトの後に、最後に配置してください。

### インターフェース実装のレイアウト

インターフェースを実装する場合、実装するメンバーはインターフェースのメンバーと同じ順序に保ってください（必要であれば、
実装に使用される追加のプライベートメソッドを間に挟んでください）。

### オーバーロードのレイアウト

クラス内でオーバーロードは常に互いの隣に配置してください。

## 命名規則

Kotlinのパッケージおよびクラスの命名規則は非常にシンプルです。

*   パッケージ名は常に小文字で、アンダースコアは使用しません（`org.example.project`）。
    複数単語の名前を使用することは一般的に推奨されませんが、複数の単語を使用する必要がある場合は、
    単に連結するか、キャメルケースを使用できます（`org.example.myProject`）。

*   クラス名とオブジェクト名はアッパーキャメルケースを使用します。

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 関数名

関数、プロパティ、およびローカル変数の名前は小文字で始まり、アンダースコアなしのキャメルケースを使用します。

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

テスト内（そして**テストのみ**）では、バッククォートで囲まれたスペースを含むメソッド名を使用できます。
このようなメソッド名は、APIレベル30以降のAndroidランタイムでのみサポートされていることに注意してください。
メソッド名内のアンダースコアもテストコードで許可されています。

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }
     
     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### プロパティ名

定数（`const`でマークされたプロパティ、またはカスタム`get`関数を持たず、深くイミュータブルなデータを保持するトップレベルまたはオブジェクトの`val`プロパティ）の名前は、
[スクリーミングスネークケース](https://en.wikipedia.org/wiki/Snake_case)規則に従い、すべて大文字でアンダースコアで区切られた名前を使用すべきです。

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

振る舞いや可変データを保持するトップレベルまたはオブジェクトプロパティの名前は、キャメルケースの名前を使用すべきです。

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

シングルトンオブジェクトへの参照を保持するプロパティの名前は、`object`宣言と同じ命名スタイルを使用できます。

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

列挙定数については、使用状況に応じて、すべて大文字でアンダースコアで区切られた名前（[スクリーミングスネークケース](https://en.wikipedia.org/wiki/Snake_case)）（`enum class Color { RED, GREEN }`）またはアッパーキャメルケースの名前のどちらを使用しても構いません。

### バッキングプロパティの名前

クラスに概念的には同じだが、一方が公開APIの一部であり、他方が実装の詳細である2つのプロパティがある場合、
プライベートプロパティの名前のプレフィックスとしてアンダースコアを使用してください。

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 適切な名前を選ぶ

クラスの名前は通常、そのクラスが_何であるか_を説明する名詞または名詞句です。例えば、`List`、`PersonReader`。

メソッドの名前は通常、そのメソッドが_何をするか_を説明する動詞または動詞句です。例えば、`close`、`readPersons`。
名前は、メソッドがオブジェクトを変更するのか、新しいオブジェクトを返すのかも示唆すべきです。
例えば、`sort`はコレクションをその場でソートしますが、`sorted`はコレクションのソートされたコピーを返します。

名前はエンティティの目的を明確にすべきであり、`Manager`、`Wrapper`のような意味のない単語を
名前で使用することは避けるのが最善です。

頭字語を宣言名の一部として使用する場合は、以下のルールに従ってください。

*   2文字の頭字語の場合、両方の文字を大文字にします。例: `IOStream`。
*   2文字より長い頭字語の場合、最初の文字のみを大文字にします。例: `XmlFormatter`または`HttpInputStream`。

## フォーマット

### インデント

インデントには4スペースを使用します。タブは使用しないでください。

中括弧については、開き括弧は構文が始まる行の最後に配置し、閉じ括弧は別の行に開き構文と水平に揃えて配置します。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

>Kotlinではセミコロンはオプションであり、したがって改行は重要です。言語設計は
>Javaスタイルの括弧を前提としており、異なるフォーマットスタイルを使用しようとすると
>予期せぬ動作に遭遇する可能性があります。
>
{style="note"}

### 水平方向の空白

*   二項演算子（`a + b`）の周りにはスペースを置きます。例外：範囲演算子（`0..i`）の周りにはスペースを置きません。
*   単項演算子（`a++`）の周りにはスペースを置きません。
*   制御フローキーワード（`if`、`when`、`for`、`while`）と対応する開き括弧の間にはスペースを置きます。
*   プライマリコンストラクタ宣言、メソッド宣言、またはメソッド呼び出しの開き括弧の前にスペースを置きません。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

*   `(`、`[` の後、または `]`、`)` の前にスペースを絶対に置きません。
*   `.` や `?.` の周りにはスペースを絶対に置きません: `foo.bar().filter { it > 2 }.joinToString()`, `foo?.bar()`.
*   `//` の後にはスペースを置きます: `// This is a comment`.
*   型パラメータを指定するために使用される山括弧の周りにはスペースを置きません: `class Map<K, V> { ... }`.
*   `::` の周りにはスペースを置きません: `Foo::class`, `String::length`.
*   null許容型をマークするために使用される `?` の前にはスペースを置きません: `String?`.

一般的なルールとして、あらゆる種類の水平方向の配置は避けてください。
識別子を異なる長さの名前に変更しても、宣言またはその使用箇所のフォーマットに影響を与えないようにすべきです。

### コロン

以下のシナリオでは、`:` の前にスペースを置きます。

*   型とスーパークラスを区切るために使用される場合。
*   スーパークラスのコンストラクタまたは同じクラスの別のコンストラクタに委譲する場合。
*   `object` キーワードの後。

宣言とその型を区切る場合は、`:` の前にスペースを置かないでください。

`:` の後には常にスペースを置きます。

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

いくつかのプライマリコンストラクタパラメータを持つクラスは、1行で記述できます。

```kotlin
class Person(id: Int, name: String)
```

ヘッダーが長いクラスは、各プライマリコンストラクタパラメータがインデント付きで別の行になるようにフォーマットすべきです。
また、閉じ括弧は新しい行に配置すべきです。継承を使用する場合、スーパークラスのコンストラクタ呼び出し、または
実装されたインターフェースのリストは、括弧と同じ行に配置すべきです。

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

複数のインターフェースの場合、スーパークラスコンストラクタの呼び出しを最初に配置し、その後、各インターフェースを
異なる行に配置すべきです。

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

長いスーパークラスリストを持つクラスの場合、コロンの後に改行を入れ、すべてのスーパークラス名を水平に揃えます。

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

クラスヘッダーが長い場合にクラスヘッダーとボディを明確に区切るには、クラスヘッダーの後に空行を入れるか（上記の例のように）、
または開き中括弧を別の行に配置します。

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

コンストラクタパラメータには通常のインデント（4スペース）を使用してください。これにより、プライマリコンストラクタで宣言されたプロパティが、
クラスのボディで宣言されたプロパティと同じインデントを持つことが保証されます。

### 修飾子の順序

宣言に複数の修飾子がある場合、常に以下の順序で配置してください。

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
enum / annotation / fun // as a modifier in `fun interface` 
companion
inline / value
infix
operator
data
```

すべてのアノテーションは修飾子の前に配置します。

```kotlin
@Named("Foo")
private val foo: Foo
```

ライブラリを開発している場合を除き、冗長な修飾子（例：`public`）は省略してください。

### アノテーション

アノテーションは、それが付加される宣言の前に別の行に配置し、同じインデントを適用します。

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

引数なしのアノテーションは同じ行に配置できます。

```kotlin
@JsonExclude @JvmField
var x: String
```

引数なしの単一のアノテーションは、対応する宣言と同じ行に配置できます。

```kotlin
@Test fun foo() { /*...*/ }
```

### ファイルアノテーション

ファイルアノテーションは、ファイルコメント（もしあれば）の後に、`package`ステートメントの前に配置され、
`package`とは空行で区切られます（ファイルではなくパッケージを対象としていることを強調するため）。

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 関数

関数シグネチャが1行に収まらない場合は、以下の構文を使用してください。

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

関数パラメータには通常のインデント（4スペース）を使用してください。これはコンストラクタパラメータとの一貫性を保つのに役立ちます。

ボディが単一の式で構成される関数には、式ボディを使用することを推奨します。

```kotlin
fun foo(): Int {     // bad
    return 1 
}

fun foo() = 1        // good
```

### 式ボディ

関数の式ボディの最初の行が宣言と同じ行に収まらない場合は、`=`記号を最初の行に配置し、
式ボディを4スペースインデントします。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### プロパティ

非常にシンプルな読み取り専用プロパティの場合、1行フォーマットを検討してください。

```kotlin
val isEmpty: Boolean get() = size == 0
```

より複雑なプロパティの場合、`get`と`set`キーワードは常に別の行に配置します。

```kotlin
val foo: String
    get() { /*...*/ }
```

初期化子を持つプロパティの場合、初期化子が長い場合は`=`記号の後に改行を入れ、
初期化子を4スペースインデントします。

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 制御フロー文

`if`または`when`文の条件が複数行になる場合、常に文のボディの周りに中括弧を使用してください。
条件の後続の各行は、文の開始位置から4スペースインデントしてください。
条件の閉じ括弧は、開き中括弧と一緒に別の行に配置してください。

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

これは、条件と文のボディを揃えるのに役立ちます。

`else`、`catch`、`finally`キーワード、および`do-while`ループの`while`キーワードは、
直前の中括弧と同じ行に配置します。

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

`when`文では、ブランチが1行を超える場合は、隣接するケースブロックと空行で区切ることを検討してください。

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken ->
            callback.visitValue(propName, token.value)

        Token.LBRACE -> { // ...
        }
    }
}
```

短いブランチは、条件と同じ行に、括弧なしで配置します。

```kotlin
when (foo) {
    true -> bar() // good
    false -> { baz() } // bad
}
```

### メソッド呼び出し

長い引数リストでは、開き括弧の後に改行を入れます。引数は4スペースインデントします。
複数の密接に関連する引数は同じ行にグループ化します。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

引数名と値を区切る`=`記号の周りにはスペースを置きます。

### チェイン呼び出しの折り返し

チェイン呼び出しを折り返す場合、`.`文字または`?.`演算子を次の行に、単一のインデントで配置します。

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

チェインの最初の呼び出しは通常、その前に改行を入れるべきですが、コードがその方が理にかなっている場合は省略しても構いません。

### ラムダ

ラムダ式では、中括弧の周り、およびパラメータとボディを区切る矢印の周りにスペースを使用すべきです。
呼び出しが単一のラムダを受け取る場合、可能な限り括弧の外側に渡してください。

```kotlin
list.filter { it > 10 }
```

ラムダにラベルを割り当てる場合、ラベルと開き中括弧の間にスペースを入れないでください。

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

複数行のラムダでパラメータ名を宣言する場合、パラメータ名を最初の行に配置し、その後に矢印と改行を続けます。

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

パラメータリストが1行に収まらないほど長い場合は、矢印を別の行に配置します。

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

### 末尾のカンマ

末尾のカンマとは、要素のシーケンスの最後の項目の後にあるカンマ記号です。

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

末尾のカンマを使用することには、いくつかの利点があります。

*   バージョン管理の差分がよりきれいに表示されます。変更された値にすべての焦点が当てられるためです。
*   要素の追加と並べ替えが簡単になります。要素を操作する場合、カンマを追加したり削除したりする必要がありません。
*   例えば、オブジェクト初期化子などのコード生成を簡素化します。最後の要素にもカンマを含めることができます。

末尾のカンマは完全にオプションであり、コードはなくても動作します。Kotlinスタイルガイドでは、宣言箇所での末尾のカンマの使用を推奨し、呼び出し箇所での使用はあなたの判断に委ねています。

IntelliJ IDEAフォーマッタで末尾のカンマを有効にするには、**Settings/Preferences | Editor | Code Style | Kotlin** に移動し、
**Other**タブを開いて**Use trailing comma**オプションを選択します。

#### 列挙型 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // trailing comma
}
```

#### 値引数 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // trailing comma
)
val colors = listOf(
    "red",
    "green",
    "blue", // trailing comma
)
```

#### クラスのプロパティとパラメータ {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Customer(
    val name: String,
    val lastName: String, // trailing comma
)
class Customer(
    val name: String,
    lastName: String, // trailing comma
)
```

#### 関数値パラメータ {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun powerOf(
    number: Int, 
    exponent: Int, // trailing comma
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // trailing comma
) {}
fun print(
    vararg quantity: Int,
    description: String, // trailing comma
) {}
```

#### オプションの型を持つパラメータ（セッターを含む） {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
val sum: (Int, Int, Int) -> Int = fun(
    x,
    y,
    z, // trailing comma
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### インデックスサフィックス {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // trailing comma
    ]
```

#### ラムダのパラメータ {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // trailing comma
        ->
        println("1")
    }
    println(x)
}
```

#### whenエントリー {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // trailing comma
        -> true
    else -> false
}
```

#### コレクションリテラル（アノテーション内） {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // trailing comma
])
fun run() {}
```

#### 型引数 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // trailing comma
            >()
}
```

#### 型パラメータ {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
class MyMap<
        MyKey,
        MyValue, // trailing comma
        > {}
```

#### 分割宣言 {initial-collapse-state="collapsed" collapsible="true"}

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // trailing comma
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // trailing comma
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## ドキュメンテーションコメント

より長いドキュメンテーションコメントの場合、開き`/**`を別の行に配置し、後続の各行をアスタリスクで始めます。

```kotlin
/**
 * This is a documentation comment
 * on multiple lines.
 */
```

短いコメントは1行に配置できます。

```kotlin
/** This is a short documentation comment. */
```

一般的に、`@param`および`@return`タグの使用は避けてください。
代わりに、パラメータと戻り値の説明をドキュメンテーションコメントに直接組み込み、
言及されている箇所にパラメータへのリンクを追加します。
`@param`および`@return`は、本文の流れに収まらない長文の説明が必要な場合にのみ使用してください。

```kotlin
// Avoid doing this:

/**
 * Returns the absolute value of the given number.
 * @param number The number to return the absolute value for.
 * @return The absolute value.
 */
fun abs(number: Int): Int { /*...*/ }

// Do this instead:

/**
 * Returns the absolute value of the given [number].
 */
fun abs(number: Int): Int { /*...*/ }
```

## 冗長な構造を避ける

一般的に、Kotlinの特定の構文構造がオプションであり、IDEによって冗長であるとハイライトされる場合、
コードではそれを省略すべきです。「明確さのため」という理由だけで、コードに不要な構文要素を残すべきではありません。

### Unit戻り値の型

関数が`Unit`を返す場合、戻り値の型は省略すべきです。

```kotlin
fun foo() { // ": Unit" is omitted here

}
```

### セミコロン

可能な限りセミコロンを省略してください。

### 文字列テンプレート

単純な変数を文字列テンプレートに挿入する場合、中括弧を使用しないでください。
中括弧は、より長い式の場合にのみ使用してください。

```kotlin
println("$name has ${children.size} children")
```

## 言語機能のイディオマティックな使用法

### 不変性

可変データよりも不変データを使用することを推奨します。
初期化後に変更されないローカル変数およびプロパティは常に`var`ではなく`val`として宣言してください。

変更されないコレクションを宣言するには、常に不変コレクションインターフェース（`Collection`、`List`、`Set`、`Map`）を使用してください。
コレクションインスタンスを作成するためにファクトリ関数を使用する場合、可能な限り不変コレクション型を返す関数を常に使用してください。

```kotlin
// Bad: use of a mutable collection type for value which will not be mutated
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// Good: immutable collection type used instead
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// Bad: arrayListOf() returns ArrayList<T>, which is a mutable collection type
val allowedValues = arrayListOf("a", "b", "c")

// Good: listOf() returns List<T>
val allowedValues = listOf("a", "b", "c")
```

### デフォルトパラメータ値

オーバーロードされた関数を宣言するよりも、デフォルトパラメータ値を持つ関数を宣言することを推奨します。

```kotlin
// Bad
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// Good
fun foo(a: String = "a") { /*...*/ }
```

### 型エイリアス

コードベースで複数回使用される関数型または型パラメータを持つ型がある場合、
その型に型エイリアスを定義することを推奨します。

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```
名前の衝突を避けるためにprivateまたはinternalの型エイリアスを使用する場合、
[Packages and Imports](packages.md)で言及されている`import ... as ...`を推奨します。

### ラムダパラメータ

短く、ネストされていないラムダでは、パラメータを明示的に宣言する代わりに`it`規約を使用することを推奨します。
パラメータを持つネストされたラムダでは、常にパラメータを明示的に宣言してください。

### ラムダ内の戻り値

ラムダ内で複数のラベル付き戻り値を使用することは避けてください。ラムダを単一の終了点を持つように再構築することを検討してください。
それが不可能または明確でない場合は、ラムダを匿名関数に変換することを検討してください。

ラムダの最後の文に対してラベル付き戻り値を使用しないでください。

### 名前付き引数

メソッドが同じプリミティブ型の複数のパラメータを受け取る場合、または`Boolean`型のパラメータに対しては、
すべてのパラメータの意味がコンテキストから完全に明確である場合を除き、名前付き引数構文を使用してください。

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 条件文

`try`、`if`、および`when`の式形式を使用することを推奨します。

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 -> "zero"
    else -> "nonzero"
}
```

上記は以下よりも推奨されます。

```kotlin
if (x)
    return foo()
else
    return bar()
```

```kotlin
when(x) {
    0 -> return "zero"
    else -> return "nonzero"
}    
```

### `if` 対 `when`

二項条件には`when`ではなく`if`を使用することを推奨します。
例えば、`if`で以下の構文を使用します。

```kotlin
if (x == null) ... else ...
```

`when`で以下の構文を使用する代わりに。

```kotlin
when (x) {
    null -> // ...
    else -> // ...
}
```

3つ以上のオプションがある場合は`when`を使用することを推奨します。

### when式のガード条件

`when`式または[ガード条件](control-flow.md#guard-conditions-in-when-expressions)を持つ文で複数のブール式を組み合わせる場合は、括弧を使用してください。

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty() || status.info.id == null) -> "no information"
}
```

代わりに:

```kotlin
when (status) {
    is Status.Ok if status.info.isEmpty() || status.info.id == null -> "no information"
}
```

### 条件内のNull許容Boolean値

条件文でNull許容の`Boolean`を使用する必要がある場合は、`if (value == true)`または`if (value == false)`チェックを使用してください。

### ループ

ループよりも高階関数（`filter`、`map`など）を使用することを推奨します。
例外: `forEach`のレシーバーがnull許容であるか、`forEach`が長い呼び出しチェインの一部として使用されている場合を除き、
`forEach`の代わりに通常の`for`ループを使用することを推奨します。

複数の高階関数を使用した複雑な式とループの間で選択を行う際には、
それぞれのケースで実行される操作のコストを理解し、パフォーマンスの考慮事項を念頭に置いてください。

### 範囲のループ

開いた範囲をループするには、`..<`演算子を使用します。

```kotlin
for (i in 0..n - 1) { /*...*/ }  // bad
for (i in 0..<n) { /*...*/ }  // good
```

### 文字列

文字列連結よりも文字列テンプレートを推奨します。

通常の文字列リテラルに`
`エスケープシーケンスを埋め込むよりも、複数行文字列を推奨します。

複数行文字列のインデントを維持するには、結果の文字列に内部インデントが不要な場合は`trimIndent`を、
内部インデントが必要な場合は`trimMargin`を使用します。

```kotlin
fun main() {
//sampleStart
   println("""
    Not
    trimmed
    text
    """
   )

   println("""
    Trimmed
    text
    """.trimIndent()
   )

   println()

   val a = """Trimmed to margin text:
          |if(a > 1) {
          |    return a
          |}""".trimMargin()

   println(a)
//sampleEnd
}
```
{kotlin-runnable="true"}

[JavaとKotlinの複数行文字列](java-to-kotlin-idioms-strings.md#use-multiline-strings)の違いを学んでください。

### 関数 対 プロパティ

いくつかのシナリオでは、引数なしの関数が読み取り専用プロパティと交換可能である場合があります。
セマンティクスは似ていますが、どちらを優先すべきかについてはいくつかのスタイル上の慣習があります。

基盤となるアルゴリズムが以下の条件を満たす場合、関数よりもプロパティを推奨します。

*   例外をスローしない。
*   計算コストが低い（または初回実行時にキャッシュされる）。
*   オブジェクトの状態が変更されていない限り、呼び出しごとに同じ結果を返す。

### 拡張関数

拡張関数を自由に活用してください。あるオブジェクトに対して主に動作する関数がある場合はいつでも、そのオブジェクトをレシーバーとして受け取る拡張関数にすることを検討してください。
APIの汚染を最小限に抑えるため、意味が通じる限り拡張関数の可視性を制限してください。
必要に応じて、ローカル拡張関数、メンバー拡張関数、またはプライベート可視性を持つトップレベル拡張関数を使用してください。

### 中置関数

関数を`infix`として宣言するのは、同様の役割を果たす2つのオブジェクトに作用する場合のみにしてください。
良い例: `and`、`to`、`zip`。悪い例: `add`。

レシーバーオブジェクトを変更するメソッドを`infix`として宣言しないでください。

### ファクトリ関数

クラスのファクトリ関数を宣言する場合、クラス自体と同じ名前を付けることは避けてください。
ファクトリ関数の動作が特別である理由を明確にする、明確な名前を使用することを推奨します。
本当に特別なセマンティクスがない場合にのみ、クラスと同じ名前を使用できます。

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

異なるスーパークラスコンストラクタを呼び出さず、デフォルト引数値を持つ単一のコンストラクタに還元できない、
複数のオーバーロードされたコンストラクタを持つオブジェクトがある場合、オーバーロードされたコンストラクタをファクトリ関数に置き換えることを推奨します。

### プラットフォーム型

プラットフォーム型の式を返す公開関数/メソッドは、そのKotlin型を明示的に宣言しなければなりません。

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

プラットフォーム型の式で初期化されるプロパティ（パッケージレベルまたはクラスレベル）は、そのKotlin型を明示的に宣言しなければなりません。

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

プラットフォーム型の式で初期化されるローカル値は、型宣言があってもなくても構いません。

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### スコープ関数 apply/with/run/also/let

Kotlinは、指定されたオブジェクトのコンテキストでコードブロックを実行するための一連の関数、
すなわち`let`、`run`、`with`、`apply`、`also`を提供します。
ケースに合った適切なスコープ関数を選択するためのガイダンスについては、[スコープ関数](scope-functions.md)を参照してください。

## ライブラリのためのコーディング規約

ライブラリを記述する場合、APIの安定性を確保するために、追加のルールセットに従うことを推奨します。

*   メンバーの可視性を常に明示的に指定する（意図せず宣言を公開APIとして公開することを避けるため）。
*   関数の戻り値の型とプロパティの型を常に明示的に指定する（実装が変更されたときに意図せず戻り値の型を変更することを避けるため）。
*   すべての公開メンバーに[KDoc](kotlin-doc.md)コメントを提供する。ただし、新しいドキュメントを必要としないオーバーライドを除く（ライブラリのドキュメント生成をサポートするため）。

ライブラリのAPIを記述する際に考慮すべきベストプラクティスとアイデアについては、[ライブラリ作成者向けガイドライン](api-guidelines-introduction.md)で詳しく学んでください。