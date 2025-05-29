[//]: # (title: Kotlinコードのドキュメント化: KDoc)

Kotlinコードをドキュメント化するために使用される言語（JavaのJavadocに相当するもの）は、**KDoc** と呼ばれます。本質的に、KDocは、Javadocのブロックタグ（Kotlin特有の構文をサポートするように拡張されています）の構文と、インラインマークアップのためのMarkdownを組み合わせています。

> KotlinのドキュメントエンジンであるDokkaは、KDocを理解し、様々な形式でドキュメントを生成するために使用できます。
> 詳細については、[Dokkaのドキュメント](dokka-introduction.md)をお読みください。
>
{style="note"}

## KDoc構文

Javadocと同様に、KDocコメントは `/**` で始まり `*/` で終わります。コメントの各行はアスタリスクで始まることがありますが、これはコメントの内容の一部とは見なされません。

慣例として、ドキュメントテキストの最初の段落（最初の空白行までのテキストブロック）は要素の要約説明であり、それに続くテキストが詳細説明となります。

すべてのブロックタグは新しい行で始まり、`@` 文字で開始されます。

KDocを使用してドキュメント化されたクラスの例を以下に示します。

```kotlin
/**
 * A group of *members*.
 *
 * This class has no useful logic; it's just a documentation example.
 *
 * @param T the type of a member in this group.
 * @property name the name of this group.
 * @constructor Creates an empty group.
 */
class Group<T>(val name: String) {
    /**
     * Adds a [member] to this group.
     * @return the new size of the group.
     */
    fun add(member: T): Int { ... }
}
```

### ブロックタグ

KDocは現在、以下のブロックタグをサポートしています。

### @param _名前_

関数における値パラメータ、またはクラス、プロパティ、関数の型パラメータをドキュメント化します。
パラメータ名と説明をより明確に区別するために、必要であればパラメータ名を角括弧で囲むことができます。したがって、以下の2つの構文は同等です。

```none
@param name description.
@param[name] description.
```

### @return

関数の戻り値をドキュメント化します。

### @constructor

クラスのプライマリコンストラクタをドキュメント化します。

### @receiver

拡張関数のレシーバをドキュメント化します。

### @property _名前_

指定された名前を持つクラスのプロパティをドキュメント化します。このタグは、プロパティの定義の直前にドキュメントコメントを置くのが不自然な、プライマリコンストラクタで宣言されたプロパティのドキュメント化に使用できます。

### @throws _クラス_, @exception _クラス_

メソッドによってスローされる可能性のある例外をドキュメント化します。Kotlinにはチェック例外がないため、可能なすべての例外がドキュメント化されるという期待もありませんが、クラスのユーザーにとって有用な情報を提供する場合には、このタグを使用できます。

### @sample _識別子_

指定された完全修飾名を持つ関数の本体を、現在の要素のドキュメントに埋め込み、要素がどのように使用されうるかの例を示します。

### @see _識別子_

ドキュメントの**関連項目 (See also)** ブロックに、指定されたクラスまたはメソッドへのリンクを追加します。

### @author

ドキュメント化されている要素の作者を指定します。

### @since

ドキュメント化されている要素が導入されたソフトウェアのバージョンを指定します。

### @suppress

生成されるドキュメントから要素を除外します。モジュールの公式APIの一部ではないが、外部から参照可能である必要がある要素に使用できます。

> KDocは `@deprecated` タグをサポートしていません。代わりに、[`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) アノテーションを使用してください。
>
{style="note"}

## インラインマークアップ

インラインマークアップには、KDocは通常の[Markdown](https://daringfireball.net/projects/markdown/syntax)構文を使用し、コード内の他の要素へのリンクのための短縮構文をサポートするように拡張されています。

### 要素へのリンク

別の要素（クラス、メソッド、プロパティ、またはパラメータ）にリンクするには、その名前を角括弧で囲むだけです。

```none
Use the method [foo] for this purpose.
```

リンクにカスタムラベルを指定したい場合は、要素リンクの前に別の角括弧で囲んで追加します。

```none
Use [this method][foo] for this purpose.
```

要素リンクでは、完全修飾名も使用できます。Javadocとは異なり、完全修飾名では、メソッド名の前であっても、常にドット文字を使用してコンポーネントを区切ることに注意してください。

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

要素リンク内の名前は、ドキュメント化される要素の内部でその名前が使用されたかのように、同じルールで解決されます。特に、これは、現在のファイルに名前をインポートしている場合、KDocコメント内で使用する際に完全修飾する必要がないことを意味します。

KDocには、リンク内でオーバーロードされたメンバーを解決するための構文がないことに注意してください。Kotlinのドキュメント生成ツールは、関数のすべてのオーバーロードに関するドキュメントを同じページに配置するため、リンクが機能するために特定のオーバーロードされた関数を識別する必要はありません。

### 外部リンク

外部リンクを追加するには、通常のMarkdown構文を使用します。

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## 次のステップ

Kotlinのドキュメント生成ツールであるDokkaの使用方法を学びましょう: [Dokka](dokka-introduction.md)。