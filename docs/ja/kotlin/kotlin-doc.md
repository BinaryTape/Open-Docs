[//]: # (title: Kotlinコードをドキュメント化する: KDoc)

Kotlinコードをドキュメント化するために使用される言語（JavaのJavadocに相当）は、**KDoc**と呼ばれます。要するに、KDocは、ブロックタグ（Kotlin固有のコンストラクトをサポートするように拡張されています）にはJavadocの構文を、インラインマークアップにはMarkdownを組み合わせています。

> KotlinのドキュメンテーションエンジンであるDokkaは、KDocを理解し、さまざまな形式でドキュメントを生成できます。
> 詳細については、[Dokkaのドキュメント](dokka-introduction.md)をお読みください。
>
{style="note"}

## KDocの構文

Javadocと同様に、KDocコメントは `/**` で始まり `*/` で終わります。コメントの各行はアスタリスクで始めることができますが、これはコメントの内容の一部とは見なされません。

慣例として、ドキュメンテーションテキストの最初の段落（最初の空行までのテキストブロック）は要素の概要説明であり、その後のテキストは詳細な説明となります。

各ブロックタグは新しい行から始まり、`@` 文字で始まります。

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

### `@param _name_`

関数の値パラメータ、またはクラス、プロパティ、関数の型パラメータをドキュメント化します。パラメータ名を説明からより明確に区別したい場合は、パラメータ名を角括弧で囲むことができます。したがって、以下の2つの構文は同等です。

```none
@param name description.
@param[name] description.
```

### `@return`

関数の戻り値をドキュメント化します。

### `@constructor`

クラスのプライマリコンストラクタをドキュメント化します。

### `@receiver`

拡張関数のレシーバをドキュメント化します。

### `@property _name_`

指定された名前を持つクラスのプロパティをドキュメント化します。このタグは、プライマリコンストラクタで宣言されたプロパティをドキュメント化するのに使用できます。その場合、プロパティ定義の直前にドキュメントコメントを配置するのは不自然になります。

### `@throws _class_, @exception _class_`

メソッドによってスローされる可能性のある例外をドキュメント化します。Kotlinにはチェック例外がないため、すべての可能な例外がドキュメント化されるという期待もありませんが、このタグはクラスのユーザーに有用な情報を提供する際に使用できます。

### `@sample _identifier_`

指定された完全修飾名を持つ関数の本体を現在の要素のドキュメントに埋め込み、その要素がどのように使用され得るかの例を示すために使用します。

### `@see _identifier_`

指定されたクラスまたはメソッドへのリンクを、ドキュメントの **「関連項目」** ブロックに追加します。

### `@author`

ドキュメント化される要素の作成者を指定します。

### `@since`

ドキュメント化される要素が導入されたソフトウェアのバージョンを指定します。

### `@suppress`

生成されるドキュメントから要素を除外します。モジュールの公式APIの一部ではないが、外部から可視である必要がある要素に使用できます。

> KDocは `@deprecated` タグをサポートしていません。代わりに、[`@Deprecated`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-deprecated/) アノテーションを使用してください。
>
{style="note"}

## インラインマークアップ

インラインマークアップには、KDocは通常の[Markdown](https://daringfireball.net/projects/markdown/syntax)構文を使用しますが、コード内の他の要素へのリンクのための短縮構文をサポートするように拡張されています。

### 要素へのリンク

他の要素（クラス、メソッド、プロパティ、またはパラメータ）にリンクするには、その名前を角括弧で囲むだけです。

```none
Use the method [foo] for this purpose.
```

リンクにカスタムラベルを指定したい場合は、要素リンクの前に、別の角括弧のセットで追加します。

```none
Use [this method][foo] for this purpose.
```

要素リンクでは完全修飾名も使用できます。Javadocとは異なり、完全修飾名はメソッド名の前でも、常にドット文字を使用してコンポーネントを区切ることに注意してください。

```none
Use [kotlin.reflect.KClass.properties] to enumerate the properties of the class.
```

要素リンク内の名前は、ドキュメント化される要素内で名前が使用された場合と同じルールを使用して解決されます。特に、これは現在のファイルに名前をインポートしている場合、KDocコメントで使用する際に完全修飾する必要がないことを意味します。

KDocには、リンク内でオーバーロードされたメンバーを解決するための構文がないことに注意してください。Kotlinのドキュメント生成ツールは、関数のすべてのオーバーロードのドキュメントを同じページに配置するため、リンクを機能させるために特定のオーバーロードされた関数を識別する必要はありません。

### 外部リンク

外部リンクを追加するには、標準的なMarkdown構文を使用します。

```none
For more information about KDoc syntax, see [KDoc](<example-URL>).
```

## 次のステップ

Kotlinのドキュメント生成ツールであるDokkaの使い方はこちらです: [Dokka](dokka-introduction.md)。