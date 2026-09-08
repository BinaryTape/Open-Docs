[//]: # (title: コーディング規約)

一般的によく知られ、遵守しやすいコーディング規約は、あらゆるプログラミング言語にとって極めて重要です。
ここでは、Kotlinを使用するプロジェクトにおけるコードスタイルとコード構成に関するガイドラインを提供します。

## IDEでのスタイルの設定 {id="configure-style-in-ide"}

Kotlinで最も人気のある2つのIDEである [IntelliJ IDEA](https://www.jetbrains.com/idea/) と [Android Studio](https://developer.android.com/studio/) は、コードスタイルに関する強力なサポートを提供しています。指定されたコードスタイルに従ってコードを自動的にフォーマットするように設定できます。

### スタイルガイドの適用 {id="apply-the-style-guide"}

1. **Settings/Preferences | Editor | Code Style | Kotlin** に移動します。
2. **Set from...** をクリックします。
3. **Kotlin style guide** を選択します。

### コードがスタイルガイドに従っているか確認する {id="verify-that-your-code-follows-the-style-guide"}

1. **Settings/Preferences | Editor | Inspections | General** に移動します。
2. **Incorrect formatting** インスペクションをオンにします。
命名規則など、スタイルガイドに記載されているその他の問題を検証する追加のインスペクションは、デフォルトで有効になっています。

<!-- ガイドが移動されたら外部リンクに置き換える -->

詳細については、[IntelliJ IDEAでKotlinコードスタイルに移行する](code-style-migration-guide.md) ガイドを参照してください。

## ソースコードの構成 {id="source-code-organization"}

### ディレクトリ構造 {id="directory-structure"}

純粋なKotlinプロジェクトでは、推奨されるディレクトリ構造はパッケージ構造に従い、共通のルートパッケージを省略したものです。たとえば、プロジェクト内のすべてのコードが `org.example.kotlin` パッケージとそのサブパッケージにある場合、`org.example.kotlin` パッケージのファイルはソースルートの直下に配置し、`org.example.kotlin.network.socket` のファイルはソースルートの `network/socket` サブディレクトリに配置する必要があります。

>JVM上：KotlinがJavaと一緒に使用されるプロジェクトでは、KotlinソースファイルはJavaソースファイルと同じソースルートに配置し、同じディレクトリ構造に従う必要があります。つまり、各ファイルは各パッケージステートメントに対応するディレクトリに保存する必要があります。
>
{style="note"}

### ソースファイル名 {id="source-file-names"}

Kotlinファイルに単一のクラスまたはインターフェース（関連するトップレベルの宣言が含まれる場合もあります）が含まれている場合、その名前はクラス名と同じにし、拡張子 `.kt` を付けます。これは、すべてのタイプのクラスとインターフェースに適用されます。
ファイルに複数のクラスが含まれている場合、またはトップレベルの宣言のみが含まれている場合は、ファイルに含まれる内容を表す名前を選択し、それに応じてファイルに名前を付けます。
各単語の最初の文字を大文字にする [アッパーキャメルケース（Upper camel case）](https://en.wikipedia.org/wiki/Camel_case) を使用してください。
例：`ProcessDeclarations.kt`。

ファイルの名前は、そのファイル内のコードが何をするかを表すものであるべきです。したがって、ファイル名に `Util` のような意味のない単語を使用することは避けるべきです。

#### マルチプラットフォームプロジェクト {id="multiplatform-projects"}

マルチプラットフォームプロジェクトにおいて、プラットフォーム固有のソースセットにあるトップレベル宣言を持つファイルには、ソースセットの名前に関連付けられた接尾辞（サフィックス）を付ける必要があります。例えば：

* **jvm**Main/kotlin/Platform.**jvm**.kt
* **android**Main/kotlin/Platform.**android**.kt
* **ios**Main/kotlin/Platform.**ios**.kt

共通（common）ソースセットについては、トップレベル宣言を持つファイルに接尾辞を付けるべきではありません。例：`commonMain/kotlin/Platform.kt`。

##### 技術的な詳細 {initial-collapse-state="collapsed" collapsible="true" id="technical-details"}

JVMの制限により、マルチプラットフォームプロジェクトではこのファイル命名スキームに従うことを推奨します。JVMではトップレベルのメンバー（関数、プロパティ）が許可されていません。

これを回避するために、Kotlin JVMコンパイラは、トップレベルのメンバー宣言を含むラッパークラス（いわゆる「ファイルファサード」）を作成します。ファイルファサードは、ファイル名から派生した内部名を持ちます。

一方、JVMでは同じ完全修飾名（FQN）を持つ複数のクラスを許可していません。これにより、KotlinプロジェクトがJVM向けにコンパイルできない状況が発生する可能性があります。

```none
root
|- commonMain/kotlin/myPackage/Platform.kt // 'fun count() { }' を含む
|- jvmMain/kotlin/myPackage/Platform.kt // 'fun multiply() { }' を含む
```

ここで、両方の `Platform.kt` ファイルが同じパッケージにあるため、Kotlin JVMコンパイラは2つのファイルファサードを生成し、その両方がFQN `myPackage.PlatformKt` を持つことになります。これにより、「Duplicate JVM classes」エラーが発生します。

これを避ける最も簡単な方法は、上記のガイドラインに従ってファイルの一方の名前を変更することです。この命名スキームは、コードの可読性を維持しながら衝突を避けるのに役立ちます。

> これらの推奨事項が冗長に思えるシナリオが2つありますが、それでも従うことをお勧めします：
> 
> * JVM以外のプラットフォームでは、ファイルファサードの重複による問題はありません。しかし、この命名スキームはファイル命名の一貫性を保つのに役立ちます。
> * JVM上でも、ソースファイルにトップレベルの宣言がない場合、ファイルファサードは生成されないため、名前の衝突に直面することはありません。
> 
>   しかし、この命名スキームを使用することで、単純なリファクタリングや追加によってトップレベルの関数が含まれ、結果として同じ「Duplicate JVM classes」エラーが発生するような状況を避けることができます。
> 
{style="tip"}

### ソースファイルの構成 {id="source-file-organization"}

複数の宣言（クラス、トップレベルの関数、またはプロパティ）を同じKotlinソースファイルに配置することは、それらの宣言が意味的に互いに密接に関連しており、ファイルサイズが妥当な範囲（数百行を超えない程度）に収まる限り、推奨されます。

特に、あるクラスのすべてのクライアントに関連する拡張関数を定義する場合は、そのクラス自体と同じファイルに配置してください。特定のクライアントに対してのみ意味をなす拡張関数を定義する場合は、そのクライアントのコードの隣に配置してください。あるクラスのすべての拡張を保持するためだけのファイルを作成することは避けてください。

### クラスのレイアウト {id="class-layout"}

クラスの内容は、次の順序で配置する必要があります。

1. プロパティ宣言と初期化ブロック
2. セカンダリコンストラクタ
3. メソッド宣言
4. コンパニオンオブジェクト

メソッド宣言をアルファベット順や可視性でソートしないでください。また、通常のメソッドと拡張メソッドを分けないでください。代わりに、関連するものをまとめて配置し、クラスを上から下に読む人が何が起きているかのロジックを追えるようにします。順序を選択し（高レベルなものを先に、またはその逆）、それに固執してください。

ネストされたクラスは、それらのクラスを使用するコードの隣に配置してください。クラスが外部で使用されることが意図されており、クラス内で参照されていない場合は、コンパニオンオブジェクトの後の最後に配置してください。

### インターフェース実装のレイアウト {id="interface-implementation-layout"}

インターフェースを実装する場合、実装するメンバーの順序をインターフェースのメンバーと同じ順序に保ってください（必要に応じて、実装に使用される追加のプライベートメソッドを間に挟んでください）。

### オーバーロードのレイアウト {id="overload-layout"}

オーバーロードは常にクラス内で隣り合わせに配置してください。

## 命名規則 {id="naming-rules"}

Kotlinにおけるパッケージとクラスの命名規則は非常にシンプルです。

* パッケージ名は常に小文字で、アンダースコアを使用しません (`org.example.project`)。複数の単語からなる名前を使用することは一般的に推奨されませんが、どうしても複数の単語を使用する必要がある場合は、そのまま連結するか、キャメルケースを使用します (`org.example.myProject`)。

* クラスとオブジェクトの名前にはアッパーキャメルケースを使用します。

```kotlin
open class DeclarationProcessor { /*...*/ }

object EmptyDeclarationProcessor : DeclarationProcessor() { /*...*/ }
```

### 関数名 {id="function-names"}
 
関数、プロパティ、およびローカル変数の名前は小文字で始まり、アンダースコアなしのキャメルケースを使用します。

```kotlin
fun processDeclarations() { /*...*/ }
var declarationCount = 1
```

### クラスのような関数の名前 {id="names-for-class-like-functions"}

関数名がクラスの命名規則に従うべき2つの例外があります。この種の関数は通常、トップレベルで定義されます。

* クラスインスタンスを作成するファクトリ関数は、抽象戻り値型と同じ名前にすることができます。

   ```kotlin
   interface Foo { /*...*/ }

   class FooImpl : Foo { /*...*/ }

   fun Foo(): Foo { return FooImpl() }
   ```

* `Unit` を返す `@Composable` 関数：

   ```kotlin
   @Composable fun TabHeader { /*...*/ }
   ```

### テストメソッドの名前 {id="names-for-test-methods"}

テストにおいて（**テストにおいてのみ**）、バッククォートで囲まれたスペースを含むメソッド名を使用できます。このようなメソッド名は、AndroidランタイムではAPIレベル30からのみサポートされていることに注意してください。テストコードでは、メソッド名にアンダースコアを使用することも許可されます。

```kotlin
class MyTestCase {
    @Test fun `ensure everything works`() { /*...*/ }

    @Test fun ensureEverythingWorks_onAndroid() { /*...*/ }
}
```

### プロパティ名 {id="property-names"}

定数（`const` でマークされたプロパティ、またはカスタム `get` 関数を持たず深い不変データを保持するトップレベルやオブジェクトの `val` プロパティ）の名前は、[スクリーミングスネークケース（Screaming snake case）](https://en.wikipedia.org/wiki/Snake_case) 規則に従い、すべて大文字でアンダースコアで区切った名前を使用する必要があります。

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

振る舞いを持つオブジェクトや可変データを保持するトップレベルまたはオブジェクトプロパティの名前には、キャメルケースの名前を使用します。

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

シングルトンオブジェクトへの参照を保持するプロパティの名前には、`object` 宣言と同じ命名スタイルを使用できます。

```kotlin
val PersonComparator: Comparator<Person> = /*...*/
```

列挙型（enum）の定数については、使用法に応じて、すべて大文字でアンダースコア区切りの（[スクリーミングスネークケース](https://en.wikipedia.org/wiki/Snake_case)）名前 (`enum class Color { RED, GREEN }`) またはアッパーキャメルケースの名前のいずれを使用しても構いません。
   
### バッキングプロパティの命名 {id="names-for-backing-properties"}

クラスに、概念的には同じだが一方はパブリックAPIの一部、もう一方は実装の詳細である2つのプロパティがある場合、プライベートプロパティの名前のプレフィックスとしてアンダースコアを使用してください。

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
        get() = _elementList
}
```

### 適切な名前の選択 {id="choose-good-names"}

クラスの名前は通常、そのクラスが何であるかを説明する名詞または名詞句です： `List`、`PersonReader`。

メソッドの名前は通常、そのメソッドが何をするかを表す動詞または動詞句です： `close`、`readPersons`。
また、名前はそのメソッドがオブジェクトを変更するのか、それとも新しいオブジェクトを返すのかを示唆する必要があります。例えば、 `sort` はコレクションをその場でソートし、 `sorted` はコレクションのソートされたコピーを返します。

名前はそのエンティティの目的を明確にする必要があるため、名前の中に意味のない単語 (`Manager`、`Wrapper`) を使用することは避けるのが最善です。

頭文字語（アクロニム）を宣言名の一部として使用する場合は、以下の規則に従ってください。

* 2文字の頭文字語の場合は、両方の文字を大文字にします。例： `IOStream`。
* 3文字以上の頭文字語の場合は、最初の文字のみを大文字にします。例： `XmlFormatter` や `HttpInputStream`。

## フォーマット {id="formatting"}

### インデント {id="indentation"}

インデントには4つのスペースを使用してください。タブは使用しないでください。

波括弧については、開き括弧を構文が始まる行の最後に置き、閉じ括弧を構文の開始行と水平方向に揃えて別の行に置きます。

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

>Kotlinではセミコロンはオプションであるため、改行には重要な意味があります。言語設計ではJavaスタイルの波括弧を想定しており、別のフォーマットスタイルを使用しようとすると予期しない動作に遭遇する可能性があります。
>
{style="note"}

### 水平方向の空白 {id="horizontal-whitespace"}

* 二項演算子の前後にはスペースを入れます (`a + b`)。例外： 「range to」演算子 (`0..i`) の前後にはスペースを入れないでください。
* 単項演算子の前後にはスペースを入れないでください (`a++`)。
* 制御フローのキーワード (`if`、`when`、`for`、`while`) と、それに対応する開き括弧の間にはスペースを入れます。
* プライマリコンストラクタ宣言、メソッド宣言、またはメソッド呼び出しの開き括弧の前にスペースを入れないでください。

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

* `(`、`[` の後、または `]`、`)` の前にスペースを入れないでください。
* `.` や `?.` の前後にスペースを入れないでください： `foo.bar().filter { it > 2 }.joinToString()`、`foo?.bar()`。
* `//` の後にスペースを入れます： `// これはコメントです`。
* 型パラメータを指定するために使用される山括弧の周囲にスペースを入れないでください： `class Map<K, V> { ... }`。
* `::` の周囲にスペースを入れないでください： `Foo::class`、`String::length`。
* ヌル許容型をマークするために使用される `?` の前にスペースを入れないでください： `String?`。

一般的な規則として、いかなる種類の水平方向の整列も避けてください。識別子の名前を異なる長さの名前に変更したとしても、宣言や使用箇所のフォーマットに影響を与えないようにすべきです。

### コロン {id="colon"}

以下のシナリオでは、 `:` の前にスペースを入れます。

* 型とスーパータイプを区切るために使用される場合。
* スーパークラスのコンストラクタや同じクラスの別のコンストラクタに委譲する場合。
* `object` キーワードの後。
    
宣言とその型を区切る場合は、 `:` の前にスペースを入れないでください。
 
`:` の後には常にスペースを入れます。

```kotlin
abstract class Foo<out T : Any> : IFoo {
    abstract fun foo(a: Int): T
}

class FooImpl : Foo() {
    constructor(x: String) : this(x) { /*...*/ }

    val x = object : IFoo { /*...*/ } 
}
```

### クラスヘッダー {id="class-headers"}

プライマリコンストラクタのパラメータが少ないクラスは、1行で書くことができます。

```kotlin
class Person(id: Int, name: String)
```

ヘッダーが長いクラスは、各プライマリコンストラクタのパラメータがインデントされて別の行になるようにフォーマットする必要があります。また、閉じ括弧は新しい行に置く必要があります。継承を使用する場合、スーパークラスのコンストラクタ呼び出しや実装されたインターフェースのリストは、括弧と同じ行に配置する必要があります。

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { /*...*/ }
```

複数のインターフェースがある場合、スーパークラスのコンストラクタ呼び出しを最初に配置し、各インターフェースを異なる行に配置する必要があります。

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { /*...*/ }
```

スーパータイプのリストが長いクラスの場合は、コロンの後に改行を入れ、すべてのスーパータイプ名を水平方向に揃えます。

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { /*...*/ }
}
```

クラスヘッダーが長い場合に、クラスヘッダーとボディを明確に区別するには、クラスヘッダーの後に空行を入れるか（上の例のように）、開き波括弧を別の行に置きます。

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne 
{
    fun foo() { /*...*/ }
}
```

コンストラクタのパラメータには通常のインデント（4つのスペース）を使用してください。これにより、プライマリコンストラクタで宣言されたプロパティが、クラスのボディで宣言されたプロパティと同じインデントを持つようになります。

### 修飾子の順序 {id="modifiers-order"}

宣言に複数の修飾子がある場合は、常に次の順序で配置してください。

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

すべてのアノテーションは修飾子の前に配置してください。

```kotlin
@Named("Foo")
private val foo: Foo
```

ライブラリを作成しているのでない限り、冗長な修飾子（例： `public`）は省略してください。

### アノテーション {id="annotations"}

アノテーションは、アタッチされる宣言の前の別の行に、同じインデントで配置してください。

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

引数のないアノテーションは、同じ行に配置しても構いません。

```kotlin
@JsonExclude @JvmField
var x: String
```

引数のない単一のアノテーションは、対応する宣言と同じ行に配置しても構いません。

```kotlin
@Test fun foo() { /*...*/ }
```

### ファイルアノテーション {id="file-annotations"}

ファイルアノテーションは、ファイルコメント（ある場合）の後、 `package` ステートメントの前に配置し、 `package` とは空行で区切ります（パッケージではなくファイルを対象としていることを強調するため）。

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

### 関数 {id="functions"}

関数のシグネチャが1行に収まらない場合は、次の構文を使用してください。

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType,
): ReturnType {
    // ボディ
}
```

関数のパラメータには通常のインデント（4つのスペース）を使用してください。これにより、コンストラクタのパラメータとの一貫性が保たれます。

ボディが単一の式で構成される関数の場合は、式本体（Expression body）を使用することを好みます。

```kotlin
fun foo(): Int {     // 悪い例
    return 1 
}

fun foo() = 1        // 良い例
```

### 式本体（Expression bodies） {id="expression-bodies"}

関数が式本体を持ち、その最初の行が宣言と同じ行に収まらない場合は、最初の行に `=` 記号を置き、式本体を4つのスペースでインデントします。

```kotlin
fun f(x: String, y: String, z: String) =
    veryLongFunctionCallWithManyWords(andLongParametersToo(), x, y, z)
```

### プロパティ {id="properties"}

非常にシンプルな読み取り専用プロパティについては、1行でのフォーマットを検討してください。

```kotlin
val isEmpty: Boolean get() = size == 0
```

より複雑なプロパティについては、常に `get` および `set` キーワードを別の行に配置してください。

```kotlin
val foo: String
    get() { /*...*/ }
```

初期化子を持つプロパティにおいて、その初期化子が長い場合は、 `=` 記号の後に改行を入れ、初期化子を4つのスペースでインデントしてください。

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

### 制御フロー文 {id="control-flow-statements"}

`if` または `when` 文の条件が複数行にわたる場合は、常に文のボディを波括弧で囲んでください。条件の各行を、文の開始位置に対して4つのスペースでインデントします。条件の閉じ括弧を、開き波括弧と一緒に別の行に置きます。

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

これにより、条件と文のボディを揃えることができます。

`else`、`catch`、`finally` キーワード、および `do-while` ループの `while` キーワードは、前の波括弧と同じ行に配置します。

```kotlin
if (condition) {
    // ボディ
} else {
    // else パート
}

try {
    // ボディ
} finally {
    // クリーンアップ
}
```

`when` 文において、ブランチが1行を超える場合は、隣接するケースブロックと空行で区切ることを検討してください。

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

短いブランチは波括弧なしで、条件と同じ行に配置します。

```kotlin
when (foo) {
    true -> bar() // 良い例
    false -> { baz() } // 悪い例
}
```

### メソッド呼び出し {id="method-calls"}

長い引数リストでは、開き括弧の後に改行を入れます。引数を4つのスペースでインデントします。密接に関連する複数の引数を同じ行にグループ化します。

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

引数名と値を区切る `=` 記号の周囲にスペースを入れます。

### チェイン呼び出しの折り返し {id="wrap-chained-calls"}

チェイン呼び出しを折り返す場合は、 `.` 文字または `?.` 演算子を次の行に配置し、単一のインデントを適用します。

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

チェインの最初の呼び出しの前には通常改行を入れますが、その方がコードの意味が通りやすければ省略しても構いません。

### ラムダ {id="lambdas"}

ラムダ式では、波括弧の周囲、およびパラメータをボディから区切る矢印の周囲にスペースを使用する必要があります。呼び出しが単一のラムダを受け取る場合は、可能な限り括弧の外側に渡してください。

```kotlin
list.filter { it > 10 }
```

ラムダにラベルを付ける場合は、ラベルと開き波括弧の間にスペースを入れないでください。

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

複数行のラムダでパラメータ名を宣言する場合は、最初の行に名前を置き、その後に矢印と改行を続けます。

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

パラメータリストが1行に収まらないほど長い場合は、矢印を別の行に置きます。

```kotlin
foo {
    context: Context,
    environment: Env
    ->
    context.configureEnv(environment)
}
```

### 末尾のカンマ（Trailing commas） {id="trailing-commas"}

末尾のカンマとは、一連の要素の最後の項目の後にあるカンマ記号のことです。

```kotlin
class Person(
    val firstName: String,
    val lastName: String,
    val age: Int, // 末尾のカンマ
)
```

末尾のカンマを使用することにはいくつかの利点があります。

* バージョン管理の差分（diff）がより明確になります。変更された値にのみ焦点が当たるためです。
* 要素の追加や並べ替えが容易になります。要素を操作する際にカンマを追加したり削除したりする必要がありません。
* オブジェクトの初期化子などのコード生成を簡素化します。最後の要素にもカンマを付けることができます。

末尾のカンマは完全にオプションであり、なくてもコードは動作します。Kotlinのスタイルガイドでは、宣言箇所での末尾のカンマの使用を推奨しており、呼び出し箇所については個人の判断に任せています。

IntelliJ IDEAのフォーマッタで末尾のカンマを有効にするには、 **Settings/Preferences | Editor | Code Style | Kotlin** に移動し、 **Other** タブを開いて **Use trailing comma** オプションを選択します。

#### 列挙型 {initial-collapse-state="collapsed" collapsible="true" id="enumerations"}

```kotlin
enum class Direction {
    NORTH,
    SOUTH,
    WEST,
    EAST, // 末尾のカンマ
}
```

#### 値引数 {initial-collapse-state="collapsed" collapsible="true" id="value-arguments"}

```kotlin
fun shift(x: Int, y: Int) { /*...*/ }
shift(
    25,
    20, // 末尾のカンマ
)
val colors = listOf(
    "red",
    "green",
    "blue", // 末尾의カンマ
)
```

#### クラスのプロパティとパラメータ {initial-collapse-state="collapsed" collapsible="true" id="class-properties-and-parameters"}

```kotlin
class Customer(
    val name: String,
    val lastName: String, // 末尾のカンマ
)
class Customer(
    val name: String,
    lastName: String, // 末尾のカンマ
)
```

#### 関数の値パラメータ {initial-collapse-state="collapsed" collapsible="true" id="function-value-parameters"}

```kotlin
fun powerOf(
    number: Int, 
    exponent: Int, // 末尾のカンマ
) { /*...*/ }
constructor(
    x: Comparable<Number>,
    y: Iterable<Number>, // 末尾のカンマ
) {}
fun print(
    vararg quantity: Int,
    description: String, // 末尾のカンマ
) {}
```

#### オプションの型を持つパラメータ（セッターを含む） {initial-collapse-state="collapsed" collapsible="true" id="parameters-with-optional-type-including-setters"}

```kotlin
val sum: (Int, Int, Int) -> Int = fun(
    x,
    y,
    z, // 末尾のカンマ
): Int {
    return x + y + x
}
println(sum(8, 8, 8))
```

#### インデックス付きサフィックス {initial-collapse-state="collapsed" collapsible="true" id="indexing-suffix"}

```kotlin
class Surface {
    operator fun get(x: Int, y: Int) = 2 * x + 4 * y - 10
}
fun getZValue(mySurface: Surface, xValue: Int, yValue: Int) =
    mySurface[
        xValue,
        yValue, // 末尾のカンマ
    ]
```

#### ラムダ内のパラメータ {initial-collapse-state="collapsed" collapsible="true" id="parameters-in-lambdas"}

```kotlin
fun main() {
    val x = {
            x: Comparable<Number>,
            y: Iterable<Number>, // 末尾のカンマ
        ->
        println("1")
    }
    println(x)
}
```

#### when エントリ {initial-collapse-state="collapsed" collapsible="true" id="when-entry"}

```kotlin
fun isReferenceApplicable(myReference: KClass<*>) = when (myReference) {
    Comparable::class,
    Iterable::class,
    String::class, // 末尾のカンマ
        -> true
    else -> false
}
```

#### コレクションリテラル（アノテーション内） {initial-collapse-state="collapsed" collapsible="true" id="collection-literals-in-annotations"}

```kotlin
annotation class ApplicableFor(val services: Array<String>)
@ApplicableFor([
    "serializer",
    "balancer",
    "database",
    "inMemoryCache", // 末尾のカンマ
])
fun run() {}
```

#### 型引数 {initial-collapse-state="collapsed" collapsible="true" id="type-arguments"}

```kotlin
fun <T1, T2> foo() {}
fun main() {
    foo<
            Comparable<Number>,
            Iterable<Number>, // 末尾のカンマ
            >()
}
```

#### 型パラメータ {initial-collapse-state="collapsed" collapsible="true" id="type-parameters"}

```kotlin
class MyMap<
        MyKey,
        MyValue, // 末尾のカンマ
        > {}
```

#### 分解宣言 {initial-collapse-state="collapsed" collapsible="true" id="destructuring-declarations"}

```kotlin
data class Car(val manufacturer: String, val model: String, val year: Int)
val myCar = Car("Tesla", "Y", 2019)
val (
    manufacturer,
    model,
    year, // 末尾のカンマ
) = myCar
val cars = listOf<Car>()
fun printMeanValue() {
    var meanValue: Int = 0
    for ((
        _,
        _,
        year, // 末尾のカンマ
    ) in cars) {
        meanValue += year
    }
    println(meanValue/cars.size)
}
printMeanValue()
```

## ドキュメンテーションコメント {id="documentation-comments"}

長いドキュメンテーションコメントについては、開始の `/**` を別の行に置き、その後の各行をアスタリスクで始めます。

```kotlin
/**
 * これは複数行にわたる
 * ドキュメンテーションコメントです。
 */
```

短いコメントは1行に配置できます。

```kotlin
/** これは短いドキュメンテーションコメントです。 */
```

一般的に、 `@param` および `@return` タグの使用は避けてください。代わりに、パラメータと戻り値の説明をドキュメンテーションコメントに直接組み込み、パラメータが言及されている箇所にはリンクを追加してください。 `@param` および `@return` は、本文の流れに収まらない長い説明が必要な場合にのみ使用してください。

```kotlin
// 避けるべき例：

/**
 * 指定された数値の絶対値を返します。
 * @param number 絶対値を返す対象の数値。
 * @return 絶対値。
 */
fun abs(number: Int): Int { /*...*/ }

// 推奨される例：

/**
 * 指定された [number] の絶対値を返します。
 */
fun abs(number: Int): Int { /*...*/ }
```

## 冗長な構文を避ける {id="avoid-redundant-constructs"}

一般的に、Kotlinの特定の構文構造がオプションであり、IDEによって冗長としてハイライトされている場合は、コードからそれを省略すべきです。「明確にするため」という理由だけで、不必要な構文要素をコードに残さないでください。

### Unit 戻り値型 {id="unit-return-type"}

関数が Unit を返す場合、戻り値型は省略すべきです。

```kotlin
fun foo() { // ここでは ": Unit" が省略されている

}
```

### セミコロン {id="semicolons"}

可能な限りセミコロンを省略してください。

### 文字列テンプレート {id="string-templates"}

文字列テンプレートに単純な変数を挿入する際は、波括弧を使用しないでください。波括弧はより長い式に対してのみ使用してください。

```kotlin
println("$name has ${children.size} children")
```

ドル記号の文字を文字列リテラルとして扱うには、[マルチドル文字列補間](strings.md#multi-dollar-string-interpolation) を使用してください。

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

## 言語機能の慣用的な使用 {id="idiomatic-use-of-language-features"}

### 不変性（Immutability） {id="immutability"}

可変データよりも不変データを使用することを好みます。ローカル変数やプロパティが初期化後に変更されない場合は、常に `var` ではなく `val` として宣言してください。

変更されないコレクションを宣言する場合は、常に不変なコレクションインターフェース（`Collection`、`List`、`Set`、`Map`）を使用してください。ファクトリ関数を使用してコレクションインスタンスを作成する場合、可能な限り不変なコレクション型を返す関数を常に使用してください。

```kotlin
// 悪い例：変更されない値に対して可変コレクション型を使用している
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// 良い例：代わりに不変コレクション型が使用されている
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// 悪い例：arrayListOf() は可変コレクション型である ArrayList<T> を返す
val allowedValues = arrayListOf("a", "b", "c")

// 良い例：listOf() は List<T> を返す
val allowedValues = listOf("a", "b", "c")
```

### デフォルトパラメータ値 {id="default-parameter-values"}

オーバーロードされた関数を宣言するよりも、デフォルトパラメータ値を持つ関数を宣言することを好みます。

```kotlin
// 悪い例
fun foo() = foo("a")
fun foo(a: String) { /*...*/ }

// 良い例
fun foo(a: String = "a") { /*...*/ }
```

### 型エイリアス（Type aliases） {id="type-aliases"}

コードベースで複数回使用される関数型や型パラメータを持つ型がある場合は、それに対して型エイリアスを定義することを好みます。

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```
名前の衝突を避けるためにプライベートまたは内部の型エイリアスを使用する場合は、[パッケージとインポート](packages.md)で言及されている `import ... as ...` を好みます。

### ラムダパラメータ {id="lambda-parameters"}

短く、ネストされていないラムダでは、パラメータを明示的に宣言する代わりに `it` 慣習を使用することが推奨されます。パラメータを持つネストされたラムダでは、常にパラメータを明示的に宣言してください。

### ラムダ内でのリターン {id="returns-in-a-lambda"}

ラムダ内で複数のラベル付きリターンを使用することは避けてください。単一の出口点を持つようにラムダを再構成することを検討してください。それが不可能な場合や十分に明確でない場合は、ラムダを匿名関数に変換することを検討してください。

ラムダの最後の文にラベル付きリターンを使用しないでください。

### 名前付き引数 {id="named-arguments"}

メソッドが同じ基本データ型（プリミティブ型）の複数のパラメータを取る場合、または `Boolean` 型のパラメータの場合、すべてのパラメータの意味が文脈から完全に明確でない限り、名前付き引数構文を使用してください。

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

### 条件文 {id="conditional-statements"}

`try`、`if`、`when` の式形式（expression form）を使用することを好みます。

```kotlin
return if (x) foo() else bar()
```

```kotlin
return when(x) {
    0 -> "zero"
    else -> "nonzero"
}
```

上記は、以下よりも好ましいです：

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

### if と when の使い分け {id="if-versus-when"}

二値の条件には `when` ではなく `if` を使用することを好みます。
例えば、 `if` を使用して次のように書きます：

```kotlin
if (x == null) ... else ...
```

次のように `when` を使用する代わりに：

```kotlin
when (x) {
    null -> // ...
    else -> // ...
}
```

選択肢が3つ以上ある場合は、 `when` を使用することを好みます。

### when式におけるガード条件 {id="guard-conditions-in-when-expression"}

`when` 式や文で [ガード条件](control-flow.md#guard-conditions-in-when-expressions) を使用し、複数の論理式を組み合わせる場合は、括弧を使用してください。

```kotlin
when (status) {
    is Status.Ok if (status.info.isEmpty() || status.info.id == null) -> "no information"
}
```

次のように書く代わりに：

```kotlin
when (status) {
    is Status.Ok if status.info.isEmpty() || status.info.id == null -> "no information"
}
```

### 条件文におけるヌル許容 Boolean 値 {id="nullable-boolean-values-in-conditions"}

条件文でヌル許容な（nullable） `Boolean` を使用する必要がある場合は、 `if (value == true)` または `if (value == false)` によるチェックを使用してください。

### ループ {id="loops"}

ループよりも高階関数（`filter`、`map` など）を使用することを好みます。例外： `forEach` （`forEach` のレシーバーがヌル許容である場合や、 `forEach` が長い呼び出しチェインの一部として使用されている場合を除き、通常の `for` ループを使用することを好みます）。

複数の高階関数を使用した複雑な式とループのどちらかを選択する場合、それぞれのケースで実行される操作のコストを理解し、パフォーマンスへの考慮を忘れないでください。

### レンジ（範囲）におけるループ {id="loops-on-ranges"}

開いた範囲（open-ended range）でループするには、 `..<` 演算子を使用してください。

```kotlin
for (i in 0..n - 1) { /*...*/ }  // 悪い例
for (i in 0..<n) { /*...*/ }  // 良い例
```

### 文字列 {id="strings"}

文字列の連結よりも文字列テンプレートを好みます。

通常の文字列リテラルの中に `
` エスケープシーケンスを埋め込むよりも、複数行文字列を好みます。

複数行文字列でインデントを維持するには、結果の文字列に内部的なインデントが必要ない場合は `trimIndent` を使用し、内部的なインデントが必要な場合は `trimMargin` を使用してください。

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

[JavaとKotlinの複数行文字列の違い](java-to-kotlin-idioms-strings.md#use-multiline-strings)についても学んでください。

### 関数 vs プロパティ {id="functions-vs-properties"}

いくつかのシナリオでは、引数のない関数と読み取り専用プロパティが交換可能である場合があります。意味は似ていますが、どちらを優先すべきかについてのスタイル上の慣習があります。

基礎となるアルゴリズムが以下の条件を満たす場合は、関数よりもプロパティを好みます。

* 例外をスローしない。
* 計算コストが低い（または初回実行時にキャッシュされる）。
* オブジェクトの状態が変わらなければ、呼び出しごとに同じ結果を返す。

### 拡張関数 {id="extension-functions"}

拡張関数を積極的に使用してください。主にあるオブジェクトに対して動作する関数がある場合は、常にそのオブジェクトをレシーバーとして受け取る拡張関数にすることを検討してください。APIの汚染を最小限に抑えるために、拡張関数の可視性は妥当な範囲で制限してください。必要に応じて、ローカル拡張関数、メンバー拡張関数、またはプライベートな可視性を持つトップレベル拡張関数を使用してください。

### 中置関数（Infix functions） {id="infix-functions"}

同様の役割を果たす2つのオブジェクトに対して動作する場合にのみ、関数を `infix` として宣言してください。良い例： `and`、`to`、`zip`。悪い例： `add`。

レシーバーオブジェクトを変更するメソッドを `infix` として宣言しないでください。

### ファクトリ関数 {id="factory-functions"}

クラスのためにファクトリ関数を宣言する場合、クラス自体と同じ名前を付けることは避けてください。ファクトリ関数の動作がなぜ特別なのかを明確にするために、別の名前を使用することを好みます。特別なセマンティクスが本当にない場合にのみ、クラスと同じ名前を使用できます。

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

異なるスーパークラスのコンストラクタを呼び出さず、デフォルト値を持つパラメータを含む単一のコンストラクタに集約できない複数のオーバーロードされたコンストラクタを持つオブジェクトがある場合は、オーバーロードされたコンストラクタをファクトリ関数に置き換えることを好みます。

### プラットフォーム型 {id="platform-types"}

プラットフォーム型の式を返すパブリックな関数/メソッドは、Kotlinの型を明示的に宣言する必要があります。

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

プラットフォーム型の式で初期化されるプロパティ（パッケージレベルまたはクラスレベル）は、Kotlinの型を明示的に宣言する必要があります。

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

プラットフォーム型の式で初期化されるローカル値は、型宣言を持っていても持っていなくても構いません。

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

### スコープ関数 apply/with/run/also/let {id="scope-functions-apply-with-run-also-let"}

Kotlinは、特定のオブジェクトのコンテキストでコードブロックを実行するための関数セットを提供しています： `let`、`run`、`with`、`apply`、および `also`。
ケースに合わせた適切なスコープ関数の選択については、 [スコープ関数（Scope Functions）](scope-functions.md) を参照してください。

## ライブラリのコーディング規則 {id="coding-conventions-for-libraries"}

ライブラリを作成する際には、APIの安定性を確保するために、追加の一連の規則に従うことが推奨されます。

 * 常にメンバーの可視性を明示的に指定してください（誤って宣言をパブリックAPIとして公開することを避けるため）。
 * 常に関数の戻り値の型とプロパティの型を明示的に指定してください（実装が変更されたときに誤って戻り値の型が変更されるのを避けるため）。
 * 新しいドキュメントを必要としないオーバーライドを除き、すべてのパブリックメンバーに [KDoc](kotlin-doc.md) コメントを提供してください（ライブラリのドキュメント生成をサポートするため）。

ライブラリのAPIを設計する際に考慮すべきベストプラクティスやアイデアの詳細については、 [Library authors' guidelines](api-guidelines-introduction.md) を参照してください。