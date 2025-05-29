[//]: # (title: Spring Bootプロジェクトでコレクションを操作する)

<tldr>
    <p>これは<strong>Spring BootとKotlinの入門</strong>チュートリアルの一部です。進む前に、以前のステップを完了していることを確認してください:</p><br/>
    <p><a href="jvm-create-project-with-spring-boot.md">KotlinでSpring Bootプロジェクトを作成する</a><br/><a href="jvm-spring-boot-add-data-class.md">Spring Bootプロジェクトにデータクラスを追加する</a><br/><strong>Spring Bootプロジェクトのデータベースサポートを追加する</strong><br/></p>
</tldr>

このパートでは、Kotlinでコレクションに対して様々な操作を実行する方法を学びます。
多くの場合、SQLはデータのフィルタリングやソートなどのデータ操作に役立ちますが、実際のアプリケーションでは、データを操作するためにコレクションを扱う必要があることがよくあります。

以下に、デモアプリケーションに既に存在するデータオブジェクトに基づいた、コレクションを扱うためのいくつかの役立つ手法を紹介します。
すべての例において、まず`service.findMessages()`関数を呼び出してデータベースに保存されているすべてのメッセージを取得し、その後、メッセージのリストをフィルタリング、ソート、グループ化、または変換するための様々な操作を実行することを前提とします。

## 要素の取得

Kotlinのコレクションは、コレクションから単一の要素を取得するための一連の関数を提供します。
コレクションから単一の要素を、位置または一致する条件によって取得することが可能です。

例えば、コレクションの最初と最後の要素を取得するには、対応する関数である`first()`と`last()`を使用します。

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

上記の例では、コレクションの最初と最後の要素を取得し、JSONドキュメントにシリアライズされる2つの要素の新しいリストを作成します。

特定の位置にある要素を取得するには、[`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)関数を使用できます。

`first()`関数と`last()`関数の両方で、与えられた述語に一致する要素をコレクションから検索することも可能です。
例えば、メッセージのテキストの長さが10文字より長いリスト内の最初の`Message`インスタンスを見つける方法は次のとおりです。

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

もちろん、指定された文字数制限よりも長いメッセージがない場合があります。
この場合、上記のコードは`NoSuchElementException`を生成します。
代わりに、コレクション内に一致する要素がない場合に`null`を返す`firstOrNull()`関数を使用できます。
結果が`null`かどうかを確認するのは、プログラマの責任となります。

```kotlin
@GetMapping("/retrieveFirstMessageLongerThan10")
fun firstMessageOrNull(): Message {
    val messages = service.findMessages()
    return messages.firstOrNull { 
        it.text.length > 10 
    } ?: Message(null, "Default message")
}

```

## 要素のフィルタリング

_フィルタリング_は、コレクション処理において最も一般的なタスクの1つです。
標準ライブラリには、単一の呼び出しでコレクションをフィルタリングできる一連の拡張関数が含まれています。
これらの関数は、元のコレクションを変更せずに、フィルタリングされた要素を含む新しいコレクションを生成します。

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

このコードは、`first()`関数を使用してテキスト長が10より大きい単一の要素を見つけた例と非常によく似ています。
違いは、`filter()`が条件に一致する要素のリストを返す点です。

## 要素のソート

要素の順序は、特定のコレクションタイプにおいて重要な側面です。
Kotlinの標準ライブラリは、自然順、カスタム順、逆順、ランダム順など、様々な方法でソートするための多数の関数を提供しています。

例えば、リスト内のメッセージを最後の文字でソートしてみましょう。
これは、コレクションオブジェクトから必要な値を抽出するためのセレクタを使用する`sortedBy()`関数を使うことで可能です。
リスト内の要素の比較は、抽出された値に基づいて行われます。

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 要素のグループ化

グループ化では、要素をどのようにまとめるかについて、かなり複雑なロジックを実装する必要がある場合があります。
[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)関数はラムダを受け取り、`Map`を返します。
このマップでは、各キーがラムダの結果であり、対応する値は、この結果が返された要素の`List`です。

特定の単語、例えば「hello」と「bye」に一致するメッセージをグループ化してみましょう。
メッセージのテキストが指定された単語のいずれも含まない場合、それは「その他 (other)」と呼ばれる別のグループに追加されます。

```kotlin
@GetMapping("/groups")
fun groups(): Map<String, List<Message>> {
    val messages = service.findMessages()
    val groups = listOf("hello", "bye")

    val map = messages.groupBy { message ->
        groups.firstOrNull {
            message.text.contains(it, ignoreCase = true)
        } ?: "other"
    }

    return map
}
```

## 変換操作

コレクションにおける一般的なタスクは、コレクションの要素をある型から別の型へ変換することです。
もちろん、Kotlinの標準ライブラリは、そのようなタスクのために多数の[変換関数](collection-transformations.md)を提供しています。

例えば、`Message`オブジェクトのリストを、メッセージの`id`と`text`本体を連結して構成される文字列オブジェクトのリストに変換してみましょう。
そのためには、与えられたラムダ関数を後続の各要素に適用し、ラムダの結果のリストを返す`map()`関数を使用できます。

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## 集計操作

集計操作は、値のコレクションから単一の値を計算します。
集計操作の例としては、すべてのメッセージの長さの平均を計算することが挙げられます。

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

まず、`map()`関数を使用して、メッセージのリストを各メッセージの長さを表す値のリストに変換します。
その後、`average()`関数を使用して最終結果を計算できます。

その他の集計関数の例としては、`mix()`、`max()`、`sum()`、`count()`があります。

より具体的なケースでは、提供された操作をコレクションの要素に順次適用し、累積結果を返す[`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)および[`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)関数があります。

例えば、最も長いテキストを含むメッセージを見つけてみましょう。

```kotlin
@GetMapping("findTheLongestMessage")
fun reduce(): Message {
    val messages = service.findMessages()
    return messages.reduce { first, second ->
        if (first.text.length > second.text.length) first else second
    }
}
```

## 次のステップ

[次のセクション](jvm-spring-boot-using-crudrepository.md)に進んでください。