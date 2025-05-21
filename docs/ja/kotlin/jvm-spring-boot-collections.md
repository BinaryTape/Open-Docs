---
title: "Spring Boot プロジェクトでコレクションを扱う"
---
:::info
<p>
   これは、<strong>Spring BootとKotlin入門</strong>チュートリアルの一部です。続行する前に、必ず前の手順を完了してください。
</p><br/>
<p>
   <a href="jvm-create-project-with-spring-boot">KotlinでSpring Bootプロジェクトを作成する</a><br/><a href="jvm-spring-boot-add-data-class">Spring Bootプロジェクトにデータクラスを追加する</a><br/><strong>Spring Bootプロジェクトのデータベースサポートを追加する</strong><br/>
</p>

:::

このパートでは、Kotlinのコレクションに対してさまざまな操作を実行する方法を学びます。
多くの場合、SQLはフィルタリングやソートなどのデータ操作に役立ちますが、実際のアプリケーションでは、データを操作するためにコレクションを扱う必要がよくあります。

以下に、デモアプリケーションにすでに存在するデータオブジェクトに基づいて、コレクションを操作するためのいくつかの役立つレシピを示します。
すべての例において、`service.findMessages()` 関数を呼び出してデータベースに保存されているすべてのメッセージを取得し、その後、さまざまな操作を実行してメッセージのリストをフィルタリング、ソート、グループ化、または変換することから始めることを前提としています。

## 要素の取得

Kotlinコレクションには、コレクションから単一の要素を取得するための一連の関数が用意されています。
コレクションから単一の要素を取得するには、位置または一致する条件のいずれかを使用できます。

たとえば、コレクションの最初と最後の要素を取得するには、対応する関数 `first()` および `last()` を使用します。

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

上記の例では、コレクションの最初と最後の要素を取得し、JSONドキュメントにシリアライズされる2つの要素の新しいリストを作成します。

特定のポジションにある要素を取得するには、[`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html) 関数を使用できます。

`first()` 関数と `last()` 関数はどちらも、指定された述語に一致する要素のコレクションを検索できます。
たとえば、メッセージの長さが10文字を超えるリストで最初の `Message` インスタンスを見つける方法は次のとおりです。

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

もちろん、指定された文字数制限よりも長いメッセージがない場合もあります。
この場合、上記のコードは NoSuchElementException を生成します。
または、コレクションに一致する要素がない場合に null を返すには、`firstOrNull()` 関数を使用できます。
その後、プログラマーは結果が null かどうかを確認する責任があります。

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

_フィルタリング_ は、コレクション処理で最も一般的なタスクの1つです。
標準ライブラリには、単一の呼び出しでコレクションをフィルタリングできる拡張関数のグループが含まれています。
これらの関数は、元のコレクションを変更せずに、フィルタリングされた要素を含む新しいコレクションを生成します。

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

このコードは、テキスト長が10を超える単一の要素を見つけるために `first()` 関数を使用した例と非常によく似ています。
違いは、`filter()` が条件に一致する要素のリストを返すことです。

## 要素のソート

要素の順序は、特定のコレクションタイプの重要な側面です。
Kotlinの標準ライブラリは、自然、カスタム、逆順、およびランダムな順序でソートするための多くの関数を提供します。

たとえば、リスト内のメッセージを最後の文字でソートしましょう。
これは、セレクターを使用してコレクションオブジェクトから必要な値を抽出する `sortedBy()` 関数を使用することで可能です。
リスト内の要素の比較は、抽出された値に基づいて行われます。

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 要素のグループ化

グループ化では、要素をどのようにグループ化するかについて、かなり複雑なロジックを実装する必要がある場合があります。
[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html) 関数はラムダを受け取り、`Map` を返します。
このマップでは、各キーはラムダの結果であり、対応する値は、この結果が返される要素の `List` です。

特定の単語、たとえば "hello" と "bye" を照合してメッセージをグループ化してみましょう。
メッセージのテキストに指定された単語が含まれていない場合は、"other" という別のグループに追加します。

```kotlin
@GetMapping("/groups")
fun groups(): Map<String, List<Message>> {
    val messages = service.findMessages()
    val groups = listOf("hello", "bye")

    val map = messages.groupBy { message `->`
        groups.firstOrNull {
            message.text.contains(it, ignoreCase = true)
        } ?: "other"
    }

    return map
}
```

## 変換操作

コレクションの一般的なタスクは、コレクション要素をある型から別の型に変換することです。
もちろん、Kotlin標準ライブラリは、このようなタスクのために多くの [変換関数](https://kotlinlang.org/docs/collection-transformations.html) を提供しています。

たとえば、`Message` オブジェクトのリストを、メッセージの `id` と `text` 本文を連結して構成される String オブジェクトのリストに変換しましょう。
そのためには、指定されたラムダ関数を後続の各要素に適用し、ラムダ結果のリストを返す `map()` 関数を使用できます。

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

まず、`map()` 関数を使用して、メッセージのリストを各メッセージの長さを表す値のリストに変換します。
次に、平均関数を使用して最終結果を計算できます。

集計関数のその他の例としては、`mix()`、`max()`、`sum()`、および `count()` があります。

より具体的なケースでは、提供された操作をコレクション要素に順番に適用し、累積された結果を返す関数 [`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html) と [`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html) があります。

たとえば、テキストが最も長いメッセージを見つけましょう。

```kotlin
@GetMapping("findTheLongestMessage")
fun reduce(): Message {
    val messages = service.findMessages()
    return messages.reduce { first, second `->`
        if (first.text.length > second.text.length) first else second
    }
}
```

## 次のステップ

[次のセクション](jvm-spring-boot-using-crudrepository)に進んでください。