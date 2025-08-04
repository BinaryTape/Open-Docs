[//]: # (title: Spring Bootプロジェクトでコレクションを操作する)

<tldr>
    <p>これは <strong>Spring BootとKotlin入門</strong> チュートリアルの一部です。進む前に、以下の手順を完了していることを確認してください：</p><br/>
    <p><a href="jvm-create-project-with-spring-boot.md">KotlinでSpring Bootプロジェクトを作成する</a><br/><a href="jvm-spring-boot-add-data-class.md">Spring Bootプロジェクトにデータクラスを追加する</a><br/><strong>Spring Bootプロジェクトにデータベースサポートを追加する</strong><br/></p>
</tldr>

このパートでは、Kotlinでコレクションに対して様々な操作を実行する方法を学びます。
多くの場合、SQLはフィルタリングやソートなどのデータ操作に役立ちますが、実際のアプリケーションでは、データを操作するためにコレクションを扱うことがよくあります。

以下に、デモアプリケーションに既に存在するデータオブジェクトに基づいた、コレクションを扱うための便利なレシピを紹介します。
すべての例では、まず`service.findMessages()`関数を呼び出してデータベースに保存されているすべてのメッセージを取得し、その後、メッセージのリストをフィルタリング、ソート、グループ化、または変換するための様々な操作を実行することを想定しています。

## 要素の取得

Kotlinのコレクションは、コレクションから単一の要素を取得するための一連の関数を提供します。
コレクションから単一の要素を取得するには、位置による方法と、一致する条件による方法があります。

例えば、コレクションの最初と最後の要素を取得することは、対応する関数である`first()`と`last()`によって可能になります。

```kotlin
@GetMapping("/firstAndLast")
fun firstAndLast(): List<Message> {
    val messages = service.findMessages()
    return listOf(messages.first(), messages.last())
}
```

上記の例では、コレクションの最初と最後の要素を取得し、JSONドキュメントにシリアライズされる2つの要素からなる新しいリストを作成しています。

特定の位置の要素を取得するには、[`elementAt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/element-at.html)関数を使用できます。

`first()`関数と`last()`関数はどちらも、指定された述語に一致する要素をコレクション内で検索することを可能にします。
例えば、メッセージの長さが10文字より長いリスト内の最初の`Message`インスタンスを見つける方法は次のとおりです。

```kotlin
@GetMapping("/firstMessageLongerThan10")
fun firstMessageLongerThan10(): Message {
    val messages = service.findMessages()
    return messages.first { it.text.length > 10 }
}
```

もちろん、指定された文字数制限よりも長いメッセージが存在しない場合があります。
この場合、上記のコードは`NoSuchElementException`を生成します。
代わりに、コレクション内に一致する要素がない場合にnullを返す`firstOrNull()`関数を使用できます。
結果がnullかどうかをチェックするのは、プログラマーの責任です。

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
標準ライブラリには、コレクションを1回の呼び出しでフィルタリングできる一連の拡張関数が含まれています。
これらの関数は元のコレクションを変更せず、フィルタリングされた要素を含む新しいコレクションを生成します。

```kotlin
@GetMapping("/filterMessagesLongerThan10")
fun filterMessagesLongerThan10(): List<Message> {
    val messages = service.findMessages()
    return messages.filter { it.text.length > 10 }
}
```

このコードは、`first()`関数を使用してテキストの長さが10より大きい単一の要素を見つけた例と非常によく似ています。
違いは、`filter()`が条件に一致する要素のリストを返すことです。

## 要素のソート

要素の順序は、特定のコレクション型において重要な側面です。
Kotlinの標準ライブラリは、自然順、カスタム順、逆順、ランダム順など、様々な方法でソートするための多数の関数を提供しています。

例えば、リスト内のメッセージを最後の文字でソートしてみましょう。
これは、コレクションオブジェクトから必要な値を抽出するためにセレクターを使用する`sortedBy()`関数を使用することで可能です。
リスト内の要素の比較は、抽出された値に基づいて行われます。

```kotlin
@GetMapping("/sortByLastLetter")
fun sortByLastLetter(): List<Message> {
    val messages = service.findMessages()
    return messages.sortedBy { it.text.last() }
}
```

## 要素のグループ化

グループ化には、要素をどのようにグループ化するかについて、かなり複雑なロジックを実装する必要がある場合があります。
[`groupBy()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/group-by.html)関数はラムダを受け取り、`Map`を返します。
このマップでは、各キーはラムダの結果であり、対応する値はこの結果が返された要素の`List`です。

例えば、「hello」と「bye」という特定の単語に一致させてメッセージをグループ化してみましょう。
メッセージのテキストに指定された単語のいずれも含まれていない場合は、「other」という別のグループに追加します。

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

コレクションの一般的なタスクは、コレクションの要素をある型から別の型へ変換することです。
もちろん、Kotlin標準ライブラリには、このようなタスクのための多数の[変換関数](collection-transformations.md)が提供されています。

例えば、`Message`オブジェクトのリストを、メッセージの`id`と`text`本体を連結して構成されるStringオブジェクトのリストに変換してみましょう。
そのためには、各要素に与えられたラムダ関数を適用し、ラムダの結果のリストを返す`map()`関数を使用できます。

```kotlin
@GetMapping("/transformMessagesToListOfStrings")
fun transformMessagesToListOfStrings(): List<String> {
    val messages = service.findMessages()
    return messages.map { "${it.id} ${it.text}" }
}
```

## 集約操作

集約操作は、値のコレクションから単一の値を計算します。
集約操作の例としては、すべてのメッセージの長さの平均を計算することが挙げられます。

```kotlin
@GetMapping("/averageMessageLength")
fun averageMessageLength(): Double {
    val messages = service.findMessages()
    return messages.map { it.text.length }.average()
}
```

まず、`map()`関数を使用してメッセージのリストを各メッセージの長さを表す値のリストに変換します。
その後、`average()`関数を使用して最終結果を計算できます。

その他の集約関数の例としては、`mix()`、`max()`、`sum()`、`count()`があります。

より具体的なケースでは、提供された操作をコレクションの要素に順次適用し、累積された結果を返す[`reduce()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/reduce.html)と[`fold()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/fold.html)関数があります。

例えば、最も長いテキストを持つメッセージを見つけてみましょう。

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