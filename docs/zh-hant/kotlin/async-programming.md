---
title: "非同步程式設計技巧 (Asynchronous programming techniques)"
---
數十年來，身為開發人員，我們一直面臨一個需要解決的問題 - 如何防止我們的應用程式發生阻塞（blocking）。無論我們開發的是桌面、行動裝置，甚至是伺服器端應用程式，我們都希望避免讓使用者等待，或者更糟的是，造成瓶頸，進而阻礙應用程式的擴展（scaling）。

解決這個問題的方法有很多，包括：

* [執行緒（Threading）](#threading)
* [回呼（Callbacks）](#callbacks)
* [期貨（Futures）、承諾（promises）和其他](#futures-promises-and-others)
* [反應式擴展（Reactive Extensions）](#reactive-extensions)
* [協程（Coroutines）](#coroutines)

在解釋協程是什麼之前，讓我們先簡要地回顧一下其他一些解決方案。

## 執行緒（Threading）

到目前為止，執行緒可能是避免應用程式阻塞最廣為人知的方法。

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // makes a request and consequently blocks the main thread
    return token
}
```

假設在上面的程式碼中，`preparePost` 是一個長時間運行的過程，因此會阻塞主執行緒（main thread）。我們可以做的是在一個單獨的執行緒中啟動它。這樣可以讓我們避免 UI 阻塞。這是一種非常常見的技術，但它有一系列的缺點：

* 執行緒並不便宜。執行緒需要上下文切換（context switches），這是非常耗費資源的。
* 執行緒並非無限的。可以啟動的執行緒數量受到底層作業系統的限制。在伺服器端應用程式中，這可能會造成主要的瓶頸。
* 執行緒並非總是可用的。某些平台，例如 JavaScript，甚至不支援執行緒。
* 執行緒並不容易。除錯（Debugging）執行緒和避免競爭條件（race conditions）是我們在多執行緒程式設計中常遇到的問題。

## 回呼（Callbacks）

對於回呼，其想法是將一個函數作為參數傳遞給另一個函數，並讓這個函數在進程完成後被呼叫。

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token `->` 
        submitPostAsync(token, item) { post `->` 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) `->` Unit) {
    // make request and return immediately 
    // arrange callback to be invoked later
}
```

原則上，這感覺像是一個更優雅的解決方案，但它再次存在一些問題：

* 巢狀回呼的困難。通常用作回呼的函數，最終往往需要自己的回呼。這導致了一系列的巢狀回呼，導致難以理解的程式碼。這種模式通常被稱為回呼地獄（callback hell），或 [末日金字塔（pyramid of doom）](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))，因為這些深度巢狀回呼產生的縮排會形成三角形的形狀。
* 錯誤處理很複雜。巢狀模型使得錯誤處理和這些錯誤的傳播變得更加複雜。

回呼在事件迴圈架構（event-loop architectures）中非常常見，例如 JavaScript，但即使在那裡，人們通常也已經轉向使用其他方法，例如承諾（promises）或反應式擴展（reactive extensions）。

## 期貨（Futures）、承諾（promises）和其他

期貨（futures）或承諾（promises）（其他術語可能會根據語言或平台而使用）背後的想法是，當我們進行呼叫時，我們被「承諾（_promised_）」在某個時候，該呼叫將返回一個 `Promise` 物件，然後我們就可以對其進行操作。

```kotlin
fun postItem(item: Item) {
    preparePostAsync() 
        .thenCompose { token `->` 
            submitPostAsync(token, item)
        }
        .thenAccept { post `->` 
            processPost(post)
        }
         
}

fun preparePostAsync(): Promise<Token> {
    // makes request and returns a promise that is completed later
    return promise 
}
```

這種方法需要在我們的程式設計方式上進行一系列的變更，特別是：

* 不同的程式設計模型。與回呼類似，程式設計模型從自上而下的命令式方法轉變為具有鏈式呼叫的組合模型。傳統的程式結構，例如迴圈、例外處理（exception handling）等，通常在此模型中不再有效。
* 不同的 API。通常需要學習一個全新的 API，例如 `thenCompose` 或 `thenAccept`，這在不同的平台上也可能會有所不同。
* 特定的返回類型。返回類型從我們需要的實際資料轉變為返回一個新的類型 `Promise`，必須對其進行內省（introspected）。
* 錯誤處理可能很複雜。錯誤的傳播和鏈式處理並不總是那麼直接。

## 反應式擴展（Reactive extensions）

反應式擴展（Reactive Extensions, Rx）由 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) 引入到 C# 中。雖然它肯定在 .NET 平台上使用過，但直到 Netflix 將其移植到 Java 後，並命名為 RxJava，它才真正被廣泛採用。從那時起，已經為各種平台提供了許多移植版本，包括 JavaScript（RxJS）。

Rx 背後的想法是轉向所謂的「可觀察串流（`observable streams`）」，從而我們現在將資料視為串流（無限量的資料），並且可以觀察這些串流。實際上，Rx 只是 [觀察者模式（Observer Pattern）](https://en.wikipedia.org/wiki/Observer_pattern) 與一系列擴展的結合，這些擴展允許我們對資料進行操作。

在方法上，它與期貨（Futures）非常相似，但我們可以將期貨（Future）視為返回一個離散的元素，而 Rx 返回一個串流。然而，與之前類似，它也引入了一種全新的思考程式設計模型的方式，著名的表述為：

    "everything is a stream, and it's observable"
    
這意味著一種不同的方法來解決問題，並且與我們在編寫同步程式碼時習慣的方式有很大的轉變。與期貨（Futures）相比，一個好處是，由於它被移植到如此多的平台，通常我們可以找到一致的 API 體驗，無論我們使用什麼，無論是 C#、Java、JavaScript 還是任何其他 Rx 可用的語言。

此外，Rx 確實引入了一種稍微更好的錯誤處理方法。

## 協程（Coroutines）

Kotlin 使用協程來處理非同步程式碼，協程是指可暫停的計算，也就是一個函數可以在某個點暫停其執行並在稍後恢復執行的想法。

然而，協程的一個好處是，對於開發人員來說，編寫非阻塞程式碼本質上與編寫阻塞程式碼相同。程式設計模型本身並沒有真正改變。

以下面的程式碼為例：

```kotlin
fun postItem(item: Item) {
    launch {
        val token = preparePost()
        val post = submitPost(token, item)
        processPost(post)
    }
}

suspend fun preparePost(): Token {
    // makes a request and suspends the coroutine
    return suspendCoroutine { /* ... */ } 
}
```

此程式碼將啟動一個長時間運行的操作，而不會阻塞主執行緒。`preparePost` 是一個所謂的「可暫停函數（`suspendable function`）」，因此關鍵字 `suspend` 是它的前綴。正如上面所述，這意味著該函數將執行、暫停執行並在某個時間點恢復執行。

* 函數簽名保持完全相同。唯一的區別是添加了 `suspend`。但是，返回類型是我們希望返回的類型。
* 程式碼仍然像我們編寫同步程式碼一樣編寫，自上而下，除了使用一個名為 `launch` 的函數之外，無需任何特殊的語法，該函數本質上會啟動協程（在其他教學中介紹）。
* 程式設計模型和 API 保持不變。我們可以繼續使用迴圈、例外處理（exception handling）等，並且無需學習一整套新的 API。
* 它是平台獨立的。無論我們針對的是 JVM、JavaScript 還是任何其他平台，我們編寫的程式碼都是相同的。在底層，編譯器會負責將其適應於每個平台。

協程並不是一個新的概念，更不是 Kotlin 發明的。它們已經存在了數十年，並且在其他一些程式設計語言（例如 Go）中很流行。但重要的是要注意，它們在 Kotlin 中的實現方式是，大多數功能都委託給了程式庫（libraries）。事實上，除了 `suspend` 關鍵字之外，沒有其他關鍵字被添加到該語言中。這與 C# 等語言有些不同，C# 將 `async` 和 `await` 作為語法的一部分。對於 Kotlin 來說，這些只是程式庫（library）函數。

有關更多資訊，請參閱 [協程參考（Coroutines reference）](coroutines-overview)。