[//]: # (title: コーディング規約)

よく知られ、従いやすいコーディング規約は、どのプログラミング言語にとっても不可欠です。ここでは、Kotlinを使用するプロジェクトにおけるコードスタイルとコード編成のガイドラインを提供します。

## IDEでのスタイル設定

Kotlinで最も人気のある2つのIDEである[IntelliJ IDEA](https://www.jetbrains.com/idea/)と[Android Studio](https://developer.android.com/studio/)は、コードスタイルに対して強力なサポートを提供します。これらのIDEを設定することで、与えられたコードスタイルに一貫するようにコードを自動的にフォーマットできます。
 
### スタイルガイドを適用する

1.  **Settings/Preferences | Editor | Code Style | Kotlin** に移動します。
2.  **Set from...** をクリックします。
3.  **Kotlin style guide** を選択します。

### コードがスタイルガイドに従っていることを確認する

1.  **Settings/Preferences | Editor | Inspections | General** に移動します。
2.  **Incorrect formatting** インスペクションをオンにします。
スタイルガイドで説明されているその他の問題（命名規則など）を検証する追加のインスペクションは、デフォルトで有効になっています。

## ソースコードの構成

### ディレクトリ構造

純粋なKotlinプロジェクトでは、推奨されるディレクトリ構造は、共通のルートパッケージを省略したパッケージ構造に従います。たとえば、プロジェクト内のすべてのコードが`org.example.kotlin`パッケージとそのサブパッケージにある場合、`org.example.kotlin`パッケージのファイルはソースルート直下に配置され、`org.example.kotlin.network.socket`のファイルはソースルートの`network/socket`サブディレクトリに配置されるべきです。

>JVMの場合：KotlinがJavaと共に使用されるプロジェクトでは、KotlinソースファイルはJavaソースファイルと同じソースルートに配置され、同じディレクトリ構造に従うべきです。各ファイルは、対応するパッケージステートメントのディレクトリに格納されるべきです。
>
{style="note"}

### ソースファイル名

Kotlinファイルが単一のクラスまたはインターフェース（関連するトップレベル宣言を含む可能性がある）を含む場合、その名前はクラス名と同じで、`.kt`拡張子が付加されているべきです。これはすべての種類のクラスとインターフェースに適用されます。ファイルが複数のクラスまたはトップレベル宣言のみを含む場合、ファイルの内容を記述する名前を選択し、それに応じてファイルに名前を付けます。各単語の最初の文字が大文字になる[アッパーキャメルケース](https://ja.wikipedia.org/wiki/%E3%82%AD%E3%83%A3%E3%83%A1%E3%83%AB%E3%82%B1%E3%83%BC%E3%82%B9)を使用します。例えば、`ProcessDeclarations.kt`です。

ファイルの名前は、ファイル内のコードが何をするのかを記述するべきです。そのため、ファイル名に`Util`のような意味のない単語を使用することは避けるべきです。

#### マルチプラットフォームプロジェクト

マルチプラットフォームプロジェクトでは、プラットフォーム固有のソースセット内のトップレベル宣言を持つファイルには、ソースセット名に関連付けられたサフィックスを付けるべきです。例：

*   **jvm**Main/kotlin/Platform.**jvm**.kt
*   **android**Main/kotlin/Platform.**android**.kt
*   **ios**Main/kotlin/Platform.**ios**.kt

共通ソースセットについては、トップレベル宣言を持つファイルにサフィックスを付けるべきではありません。例えば、`commonMain/kotlin/Platform.kt`です。

##### 技術的な詳細 {initial-collapse-state="collapsed" collapsible="true"}

JVMの制限により、マルチプラットフォームプロジェクトではこのファイル命名規則に従うことを推奨します。JVMはトップレベルのメンバー（関数、プロパティ）を許可しません。

これを回避するため、Kotlin JVMコンパイラはトップレベルメンバー宣言を含むラッパークラス（いわゆる「ファイルファサード」）を作成します。ファイルファサードにはファイル名から派生した内部名が付けられます。

次に、JVMは同じ完全修飾名（FQN）を持つ複数のクラスを許可しません。これにより、KotlinプロジェクトがJVMにコンパイルできない状況が発生する可能性があります。

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // contains 'fun count() { }'
|- jvmMain/kotlin/myPackage/Platform.kt // contains 'fun multiply() { }'
```

ここでは両方の`Platform.kt`ファイルが同じパッケージにあるため、Kotlin JVMコンパイラは2つのファイルファサードを生成し、どちらもFQNが`myPackage.PlatformKt`になります。これにより、「Duplicate JVM classes」エラーが発生します。

それを避ける最も簡単な方法は、上記のガイドラインに従ってファイルのいずれかの名前を変更することです。この命名規則は、コードの可読性を保ちながら衝突を回避するのに役立ちます。

>これらの推奨事項が冗長に見える2つのシナリオがありますが、それでも従うことをお勧めします。
>
> *   非JVMプラットフォームでは、ファイルファサードの重複に関する問題はありません。ただし、この命名規則はファイル命名の一貫性を保つのに役立ちます。
> *   JVMでは、ソースファイルにトップレベル宣言がない場合、ファイルファサードは生成されず、命名の衝突に直面することはありません。
>
>   しかし、この命名規則は、簡単なリファクタリングや追加でトップレベル関数が含まれることになり、同じ「Duplicate JVM classes」エラーが発生する状況を避けるのに役立ちます。
>
{style="tip"}

### ソースファイルの編成

複数の宣言（クラス、トップレベル関数、またはプロパティ）を同じKotlinソースファイルに配置することは、これらの宣言がセマンティックに密接に関連しており、ファイルサイズが妥当な範囲（数百行を超えない）である限り推奨されます。

特に、あるクラスのすべてのクライアントに関連する拡張関数を定義する場合は、そのクラス自体と同じファイルに配置します。特定のクライアントにのみ意味を持つ拡張関数を定義する場合は、そのクライアントのコードの隣に配置します。あるクラスのすべての拡張関数を保持するためだけのファイルを作成することは避けてください。

### クラスレイアウト

クラスの内容は以下の順序で記述するべきです。

1.  プロパティ宣言と初期化ブロック
2.  セカンダリコンストラクタ
3.  メソッド宣言
4.  コンパニオンオブジェクト

メソッド宣言をアルファベット順または可視性でソートしたり、通常のメソッドと拡張メソッドを分離したりしないでください。代わりに、関連するものをまとめて配置し、クラスを上から下へ読む人が何が起こっているかのロジックを追えるようにします。順序（上位レベルのものを最初にするか、その逆か）を選択し、それに固執してください。

ネストされたクラスは、それらのクラスを使用するコードの隣に配置します。クラスが外部から使用されることを意図しており、クラス内で参照されていない場合は、コンパニオンオブジェクトの後に最後に配置します。

### インターフェース実装のレイアウト

インターフェースを実装する際、実装するメンバーはインターフェースのメンバーと同じ順序に保ちます（必要に応じて、実装に使用される追加のプライベートメソッドを間に挟んでも構いません）。

### オーバーロードのレイアウト

クラス内のオーバーロードは常に互いに隣接して配置します。

## 命名規則

Kotlinにおけるパッケージとクラスの命名規則は非常にシンプルです。

*   パッケージの名前は常に小文字で、アンダースコアは使用しません（`org.example.project`）。複数語の名前を使用することは一般的に推奨されませんが、複数の単語を使用する必要がある場合は、連結するかキャメルケース（`org.example.myProject`）を使用できます。

*   クラスとオブジェクトの名前はアッパーキャメルケースを使用します。

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 関数名

関数、プロパティ、およびローカル変数の名前は小文字で始まり、アンダースコアのないキャメルケースを使用します。

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

例外：クラスのインスタンスを作成するために使用されるファクトリ関数は、抽象戻り型と同じ名前を持つことができます。

```kotlin
interface Foo { /*...*/ }

class FooImpl : Foo { /*...*/ }

fun Foo(): Foo { return FooImpl() }
```

### テストメソッドの名前

テスト内（そして**テストのみ**）では、バッククォートで囲まれたスペースを含むメソッド名を使用できます。このようなメソッド名は、APIレベル30以降のAndroidランタイムでのみサポートされていることに注意してください。メソッド名にアンダースコアを使用することもテストコードでは許可されています。

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { /*...*/ }
     
     @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### プロパティ名

定数（`const`でマークされたプロパティ、またはカスタム`get`関数がなく深く不変なデータを持つトップレベルまたはオブジェクトの`val`プロパティ）の名前は、[スクリーミングスネークケース](https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%8D%E3%83%BC%E3%82%AF%E3%82%B1%E3%83%BC%E3%82%B9)の規則に従って、すべて大文字でアンダースコアで区切られた名前を使用するべきです。

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

振る舞いを持つオブジェクトや可変データを保持するトップレベルまたはオブジェクトプロパティの名前は、キャメルケースの名前を使用するべきです。

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

シングルトンオブジェクトへの参照を保持するプロパティの名前は、`object`宣言と同じ命名スタイルを使用できます。

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

enum定数については、すべて大文字でアンダースコア区切りの名前（[スクリーミングスネークケース](https://ja.wikipedia.org/wiki/%E3%82%B9%E3%83%8D%E3%83%BC%E3%82%AF%E3%82%B1%E3%83%BC%E3%82%B9)）（`enum class Color { RED, GREEN }`）またはアッパーキャメルケースの名前のいずれを使用しても問題ありません。これは使用法によります。

### バッキングプロパティの名前

クラスが概念的に同じだが、一方がパブリックAPIの一部であり、もう一方が実装の詳細である2つのプロパティを持つ場合、プライベートプロパティの名前にアンダースコアをプレフィックスとして使用します。

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

### 良い名前を選択する

クラスの名前は通常、そのクラスが_何であるか_を説明する名詞または名詞句です：`List`、`PersonReader`。

メソッドの名前は通常、そのメソッドが_何をするか_を述べる動詞または動詞句です：`close`、`readPersons`。名前は、そのメソッドがオブジェクトを変更するのか、新しいオブジェクトを返すのかも示唆するべきです。例えば、`sort`はコレクションをその場でソートし、`sorted`はコレクションのソートされたコピーを返します。

名前はエンティティの目的を明確にするべきなので、名前の中に`Manager`、`Wrapper`のような無意味な単語を使用することは避けるのが最善です。

宣言名の一部として頭字語を使用する場合、以下の規則に従います。

*   2文字の頭字語の場合、両方の文字を大文字にします。例：`IOStream`。
*   2文字より長い頭字語の場合、最初の文字のみを大文字にします。例：`XmlFormatter`または`HttpInputStream`。

## フォーマット

### インデント

インデントにはスペース4つを使用します。タブは使用しないでください。

中括弧については、開始ブレースは構造が始まる行の末尾に配置し、終了ブレースは開始構造と水平に揃えられた別の行に配置します。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

>Kotlinではセミコロンはオプションであり、したがって改行は重要です。言語設計はJavaスタイルのブレースを想定しており、異なるフォーマットスタイルを使用しようとすると予期せぬ動作に遭遇する可能性があります。
>
{style="note"}

### 水平方向の空白

*   二項演算子（`a + b`）の周りにはスペースを入れます。例外：「range to」演算子（`0..i`）の周りにはスペースを入れません。
*   単項演算子（`a++`）の周りにはスペースを入れません。
*   制御フローキーワード（`if`、`when`、`for`、`while`）とそれに対応する開き括弧の間にはスペースを入れます。
*   プライマリコンストラクタ宣言、メソッド宣言、またはメソッド呼び出しにおける開き括弧の前にはスペースを入れません。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

*   `(`, `[` の後、または `]`, `)` の前には絶対にスペースを入れないでください。
*   `.` や `?.` の周りには絶対にスペースを入れないでください: `foo.bar().filter { it > 2 }.joinToString()`、`foo?.bar()`。
*   `//` の後にはスペースを入れます: `// This is a comment`。
*   型パラメータを指定するために使用される山括弧の周りにはスペースを入れないでください: `class Map<K, V> { ... }`。
*   `::` の周りにはスペースを入れないでください: `Foo::class`、`String::length`。
*   Nullable型を示すために使用される `?` の前にはスペースを入れないでください: `String?`。

一般的なルールとして、いかなる種類の水平アライメントも避けてください。識別子の名前を異なる長さの名前に変更しても、宣言またはその使用箇所のフォーマットに影響を与えないようにすべきです。

### コロン

以下のシナリオでは、`:` の前にスペースを入れます。

*   型とスーパタイプを区切る場合。
*   スーパークラスのコンストラクタまたは同じクラスの異なるコンストラクタにデリゲートする場合。
*   `object` キーワードの後。
    
宣言とその型を区切る`:`の前にはスペースを入れないでください。
 
`:`の後には常にスペースを入れます。

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

プライマリコンストラクタのパラメータが少ないクラスは、1行で記述できます。

```kotlin
class Person(id: Int, name: String)
```

ヘッダーが長いクラスは、各プライマリコンストラクタパラメータがインデント付きの別の行になるようにフォーマットするべきです。また、閉じ括弧は新しい行に配置します。継承を使用する場合、スーパークラスのコンストラクタ呼び出し、または実装されたインターフェースのリストは、括弧と同じ行に配置するべきです。

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

複数のインターフェースの場合、スーパークラスのコンストラクタ呼び出しを最初に配置し、その後各インターフェースを異なる行に配置するべきです。

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

スーパタイプのリストが長いクラスの場合、コロンの後に改行を入れ、すべてのスーパタイプ名を水平に揃えます。

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

クラスヘッダーが長い場合にクラスヘッダーとボディを明確に区別するため、クラスヘッダーの後に空行を入れる（上記の例のように）か、開始中括弧を別の行に配置します。

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

コンストラクタパラメータには通常のインデント（スペース4つ）を使用します。これにより、プライマリコンストラクタで宣言されたプロパティが、クラスのボディで宣言されたプロパティと同じインデントを持つことが保証されます。

### 修飾子の順序

宣言が複数の修飾子を持つ場合、常に以下の順序で配置します。

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

ライブラリの作業中でない限り、冗長な修飾子（例えば`public`）は省略します。

### アノテーション

アノテーションは、それらが付加される宣言の前に別の行に、同じインデントで配置します。

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

引数を持たないアノテーションは同じ行に配置しても構いません。

```kotlin
@JsonExclude @JvmField
var x: String
```

引数を持たない単一のアノテーションは、対応する宣言と同じ行に配置しても構いません。

```kotlin
@Test fun foo() { /*...*/ }
```

### ファイルアノテーション

ファイルアノテーションは、ファイルコメント（もしあれば）の後、`package`ステートメントの前に配置され、`package`とは空行で区切られます（ファイルではなくパッケージを対象としている事実を強調するため）。

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 関数

関数シグネチャが1行に収まらない場合、以下の構文を使用します。

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // body
}
```

関数パラメータには通常のインデント（スペース4つ）を使用します。これはコンストラクタパラメータとの一貫性を確保するのに役立ちます。

ボディが単一の式で構成される関数には、式本体（expression body）の使用を推奨します。

```kotlin
fun foo(): Int {     // bad
    return 1 
}

fun foo() = 1        // good
```

### 式本体

関数が式本体を持ち、その最初の行が宣言と同じ行に収まらない場合、`=`記号を最初の行に配置し、式本体を4スペースでインデントします。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### プロパティ

非常にシンプルな読み取り専用プロパティの場合、1行フォーマットを検討してください。

```kotlin
val isEmpty: Boolean get() = size == 0
```

より複雑なプロパティの場合、常に`get`と`set`キーワードを別々の行に配置します。

```kotlin
val foo: String
    get() { /*...*/ }
```

初期化子を持つプロパティの場合、初期化子が長い場合は、`=`記号の後に改行を入れ、初期化子を4スペースでインデントします。

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 制御フロー文

`if`または`when`ステートメントの条件が複数行にわたる場合、ステートメントの本体を常に中括弧で囲みます。条件の各後続行は、ステートメントの開始位置から4スペースでインデントします。条件の閉じ括弧は開始中括弧とともに別の行に配置します。

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

これにより、条件とステートメント本体の位置合わせがしやすくなります。

`else`、`catch`、`finally`キーワード、および`do-while`ループの`while`キーワードは、直前の中括弧と同じ行に配置します。

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

`when`ステートメントで、分岐が1行を超える場合は、隣接するケースブロックとの間に空白行を入れて区切ることを検討してください。

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

短い分岐は、中括弧なしで条件と同じ行に配置します。

```kotlin
when (foo) {
    true -> bar() // good
    false -> { baz() } // bad
}
```

### メソッド呼び出し

長い引数リストでは、開き括弧の後に改行を入れます。引数は4スペースでインデントします。密接に関連する複数の引数は同じ行にグループ化します。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

引数名と値を区切る`=`記号の周りにはスペースを入れます。

### チェーンされた呼び出しの折り返し

チェーンされた呼び出しを折り返す場合、`.`文字または`?.`演算子を次の行に配置し、単一のインデントを付けます。

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

チェーンの最初の呼び出しは通常、その前に改行を入れるべきですが、そのようにした方がコードの意味がより明確になる場合は省略しても構いません。

### ラムダ

ラムダ式では、中括弧の周り、およびパラメータと本体を区切る矢印の周りにスペースを使用するべきです。呼び出しが単一のラムダを取る場合、可能な限り括弧の外で渡します。

```kotlin
list.filter { it > 10 }
```

ラムダにラベルを割り当てる場合、ラベルと開始中括弧の間にスペースを入れないでください。

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

複数行のラムダでパラメータ名を宣言する場合、名前を最初の行に配置し、その後に矢印と改行を続けます。

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

パラメータリストが長すぎて1行に収まらない場合は、矢印を別の行に配置します。

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

### 末尾のコンマ

末尾のコンマとは、一連の要素の最後の項目の後にあるコンマ記号のことです。

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // trailing comma
)
```

末尾のコンマを使用することにはいくつかの利点があります。

*   バージョン管理の差分がよりクリーンになります。すべての注目が変更された値に集まるためです。
*   要素の追加や並べ替えが容易になります。要素を操作する際にコンマを追加したり削除したりする必要がありません。
*   例えばオブジェクト初期化子などのコード生成を簡素化します。最後の要素にもコンマを付けることができます。

末尾のコンマは完全にオプションです。これらがない場合でもコードは動作します。Kotlinスタイルガイドは、宣言箇所での末尾のコンマの使用を推奨しており、呼び出し箇所での使用は任意としています。

IntelliJ IDEAフォーマッターで末尾のコンマを有効にするには、**Settings/Preferences | Editor | Code Style | Kotlin** に移動し、**Other**タブを開いて**Use trailing comma**オプションを選択します。

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

#### 関数の値パラメータ {initial-collapse-state="collapsed" collapsible="true"}

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

#### インデックス付けサフィックス {initial-collapse-state="collapsed" collapsible="true"}

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

#### whenエントリ {initial-collapse-state="collapsed" collapsible="true"}

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

#### 分解宣言 {initial-collapse-state="collapsed" collapsible="true"}

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

長いドキュメンテーションコメントの場合、開始の`/**`を別の行に配置し、後続の各行をアスタリスクで始めます。

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

一般的に、`@param`と`@return`タグの使用は避けてください。代わりに、パラメータと戻り値の説明を直接ドキュメンテーションコメントに含め、パラメータが言及されている箇所にリンクを追加します。`@param`と`@return`は、本文の流れに収まらない詳細な説明が必要な場合にのみ使用します。

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

## 冗長な構造の回避

一般的に、Kotlinにおける特定の構文構造がオプションであり、IDEによって冗長であるとハイライトされる場合、コードから省略するべきです。「明確さのため」という理由だけで不必要な構文要素をコードに残さないでください。

### Unit戻り型

関数がUnitを返す場合、戻り型は省略するべきです。

```kotlin
fun foo() { // ": Unit" is omitted here

}
```

### セミコロン

可能な限りセミコロンを省略します。

### 文字列テンプレート

シンプルな変数を文字列テンプレートに挿入する場合、中括弧を使用しないでください。中括弧は長い式の場合にのみ使用します。

```kotlin
println("$name has ${children.size} children")
```

ドル記号を文字列リテラルとして扱うには、[マルチダラー文字列補間](strings.md#multi-dollar-string-interpolation)を使用します。

```kotlin
val KClass<*>.jsonSchema : String
get() = $"""
    {
      "$schema": "https://json-schema.org/draft/2020-12/schema",
      "$id": "https://example.com/product.schema.json",
      "$dynamicAnchor": "meta",
      "title": "${simpleName ?: qualifiedName ?: "unknown"}",
      "type": "object"
    }
    """
```

## 言語機能の慣用的な使用法

### 不変性

可変データよりも不変データを使用することを推奨します。初期化後に変更されないローカル変数とプロパティは、常に`var`ではなく`val`として宣言します。

変更されないコレクションを宣言するには、常に不変のコレクションインターフェース（`Collection`、`List`、`Set`、`Map`）を使用します。コレクションインスタンスを作成するためにファクトリ関数を使用する場合、可能な限り不変のコレクション型を返す関数を常に使用します。

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

コードベースで複数回使用される関数型または型パラメータを持つ型がある場合、それに対して型エイリアスを定義することを推奨します。

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```
名前衝突を避けるためにprivateまたはinternalの型エイリアスを使用する場合、[パッケージとインポート](packages.md)で言及されている`import ... as ...`を推奨します。

### ラムダパラメータ

短くネストされていないラムダでは、パラメータを明示的に宣言する代わりに`it`規約を使用することを推奨します。パラメータを持つネストされたラムダでは、常にパラメータを明示的に宣言します。

### ラムダ内のreturn

ラムダ内で複数のラベル付き`return`を使用することは避けてください。ラムダを単一の終了点を持つように再構築することを検討してください。それが不可能な場合、または十分に明確でない場合は、ラムダを匿名関数に変換することを検討してください。

ラムダ内の最後のステートメントにラベル付き`return`を使用しないでください。

### 名前付き引数

メソッドが同じプリミティブ型の複数のパラメータを取る場合、または`Boolean`型のパラメータに対しては、すべてのパラメータの意味がコンテキストから完全に明確でない限り、名前付き引数構文を使用します。

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 条件文

`try`、`if`、`when`の式形式の使用を推奨します。

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

### if 対 when

二項条件には`when`ではなく`if`を使用することを推奨します。
例えば、`if`を使ったこの構文を使用します。

```kotlin
if (x == null) ... else ...
```

`when`を使った以下の構文の代わりに。

```kotlin
when (x) {
    null -> // ...
    else -> // ...
}
```

3つ以上の選択肢がある場合は`when`の使用を推奨します。

### when式におけるガード条件

[ガード条件](control-flow.md#guard-conditions-in-when-expressions)を持つ`when`式またはステートメントで複数のブール式を組み合わせる場合は、括弧を使用します。

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty() || status.info.id == null) -> "no information"
}
```

以下の代わりに：

```kotlin
when (status) {
    is Status.Ok if status.info.isEmpty() || status.info.id == null -> "no information"
}
```

### 条件におけるnullableなBoolean値

条件文でnullableな`Boolean`を使用する必要がある場合は、`if (value == true)`または`if (value == false)`チェックを使用します。

### ループ

ループよりも高階関数（`filter`、`map`など）の使用を推奨します。例外：`forEach`（`forEach`のレシーバーがnullableであるか、`forEach`が長い呼び出しチェーンの一部として使用される場合を除き、代わりに通常の`for`ループの使用を推奨します）。

複数の高階関数を使用する複雑な式とループの間で選択をする際には、各ケースで実行される操作のコストを理解し、パフォーマンスの考慮事項を念頭に置いてください。

### 区間に対するループ

開区間をループするには`..<`演算子を使用します。

```kotlin
for (i in 0..n - 1) { /*...*/ }  // bad
for (i in 0..<n) { /*...*/ }  // good
```

### 文字列

文字列連結よりも文字列テンプレートの使用を推奨します。

通常の文字列リテラルに`
`エスケープシーケンスを埋め込むよりも、複数行文字列の使用を推奨します。

複数行文字列のインデントを維持するには、結果の文字列に内部インデントが不要な場合は`trimIndent`を、内部インデントが必要な場合は`trimMargin`を使用します。

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
{kotlin-runnable="true"}

[JavaとKotlinの複数行文字列](java-to-kotlin-idioms-strings.md#use-multiline-strings)の違いを学びましょう。

### 関数とプロパティ

いくつかのシナリオでは、引数を持たない関数は読み取り専用プロパティと交換可能です。セマンティクスは似ていますが、どちらを優先するかについてはいくつかのスタイル上の慣習があります。

基になるアルゴリズムが以下の条件を満たす場合、関数よりもプロパティを優先します。

*   例外をスローしない。
*   計算コストが低い（または初回実行時にキャッシュされる）。
*   オブジェクトの状態が変更されていない場合、呼び出し間で同じ結果を返す。

### 拡張関数

拡張関数を自由に活用します。主にオブジェクトに対して動作する関数がある場合はいつでも、そのオブジェクトをレシーバーとして受け入れる拡張関数にすることを検討してください。APIの汚染を最小限に抑えるため、拡張関数の可視性を可能な限り制限します。必要に応じて、ローカル拡張関数、メンバー拡張関数、またはprivateな可視性を持つトップレベル拡張関数を使用します。

### Infix関数

関数を`infix`として宣言するのは、同様の役割を果たす2つのオブジェクトに対して動作する場合のみです。良い例：`and`、`to`、`zip`。悪い例：`add`。

レシーバーオブジェクトを変更するメソッドを`infix`として宣言しないでください。

### ファクトリ関数

クラスのファクトリ関数を宣言する場合、クラス自体と同じ名前を付けるのは避けてください。ファクトリ関数の動作が特別である理由を明確にする、明確な名前を使用することを推奨します。本当に特別なセマンティクスがない場合にのみ、クラスと同じ名前を使用できます。

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

異なるスーパークラスコンストラクタを呼び出さず、デフォルト値を持つパラメータを含む単一のコンストラクタに簡略化できない複数のオーバーロードされたコンストラクタを持つオブジェクトがある場合、オーバーロードされたコンストラクタをファクトリ関数に置き換えることを推奨します。

### プラットフォーム型

プラットフォーム型の式を返すpublic関数/メソッドは、そのKotlin型を明示的に宣言しなければなりません。

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

プラットフォーム型の式で初期化される任意のプロパティ（パッケージレベルまたはクラスレベル）は、そのKotlin型を明示的に宣言しなければなりません。

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

プラットフォーム型の式で初期化されるローカル値は、型宣言を持つ場合も持たない場合もあります。

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### スコープ関数 apply/with/run/also/let

Kotlinは、与えられたオブジェクトのコンテキストでコードブロックを実行するための一連の関数を提供します：`let`、`run`、`with`、`apply`、`also`。あなたのケースに最適なスコープ関数を選択するためのガイダンスについては、[スコープ関数](scope-functions.md)を参照してください。

## ライブラリのコーディング規約

ライブラリを作成する際には、APIの安定性を確保するために追加の規則に従うことを推奨します。

*   メンバーの可視性を常に明示的に指定します（誤って宣言をパブリックAPIとして公開することを避けるため）。
*   関数の戻り型とプロパティの型を常に明示的に指定します（実装が変更されたときに誤って戻り型が変わることを避けるため）。
*   ライブラリのドキュメント生成をサポートするため、新しいドキュメントを必要としないオーバーライドを除くすべてのパブリックメンバーに[KDoc](kotlin-doc.md)コメントを提供します。

ライブラリのAPIを作成する際のベストプラクティスと考慮すべき点については、[ライブラリ作成者ガイドライン](api-guidelines-introduction.md)で詳細を学びましょう。