[//]: # (title: 非同步程式設計技術)

數十年來，身為開發者，我們一直面臨著一個需要解決的問題 — 如何防止我們的應用程式阻塞。無論我們開發的是桌面、行動還是伺服器端應用程式，我們都希望避免讓使用者等待，或者更糟的是造成瓶頸，阻礙應用程式的擴展性。

為了解決這個問題，已經出現了許多方法，包括：

*   [執行緒](#threading)
*   [回呼](#callbacks)
*   [期物、承諾與其他](#futures-promises-and-others)
*   [響應式擴充功能](#reactive-extensions)
*   [協程](#coroutines)

在解釋協程是什麼之前，讓我們先簡要回顧一下其他解決方案。

## 執行緒

執行緒無疑是目前最廣為人知、避免應用程式阻塞的方法。

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

讓我們假設上述程式碼中的 `preparePost` 是一個長時間執行的程序，因此會阻塞使用者介面。我們可以在單獨的執行緒中啟動它。這樣就能避免 UI 阻塞。這是一個非常常見的技術，但它有一系列缺點：

*   執行緒並不便宜。執行緒需要耗費成本的上下文切換（context switches）。
*   執行緒並非無限。可以啟動的執行緒數量受底層作業系統限制。在伺服器端應用程式中，這可能會導致嚴重的瓶頸。
*   執行緒並非總是可用。某些平台，例如 JavaScript，甚至不支援執行緒。
*   執行緒並不容易。偵錯執行緒和避免競爭條件（race conditions）是多執行緒程式設計中常見的問題。

## 回呼

使用回呼（callbacks），其理念是將一個函式作為參數傳遞給另一個函式，並在程序完成後呼叫這個函式。

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token -> 
        submitPostAsync(token, item) { post -> 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) -> Unit) {
    // make request and return immediately 
    // arrange callback to be invoked later
}
```

這在原則上感覺是一個更優雅的解決方案，但再次面臨一些問題：

*   巢狀回呼的困難。通常，一個被用作回呼的函式，最終往往需要自己的回呼。這導致了一系列巢狀回呼，使程式碼難以理解。這種模式常被稱為「回呼地獄（callback hell）」或「[厄運金字塔](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))（pyramid of doom）」，因為這些深度巢狀回呼的縮排會形成三角形狀。
*   錯誤處理複雜。巢狀模型使得錯誤處理和錯誤傳播變得有些複雜。

回呼在事件循環（event-loop）架構中非常常見，例如 JavaScript，但即使在那裡，人們也普遍轉向使用其他方法，例如承諾（promises）或響應式擴充功能（reactive extensions）。

## 期物、承諾與其他

期物（futures）或承諾（promises）背後的理念（根據語言或平台可能使用其他術語）是，當我們發出一個呼叫時，我們被「承諾」在某個時間點該呼叫會返回一個 `Promise` 物件，然後我們可以在此物件上進行操作。

```kotlin
fun postItem(item: Item) {
    preparePostAsync() 
        .thenCompose { token -> 
            submitPostAsync(token, item)
        }
        .thenAccept { post -> 
            processPost(post)
        }
         
}

fun preparePostAsync(): Promise<Token> {
    // makes request and returns a promise that is completed later
    return promise 
}
```

這種方法需要我們在程式設計方式上進行一系列改變，尤其是在：

*   不同的程式設計模型。與回呼類似，程式設計模型從自上而下的命令式方法轉變為帶有鏈式呼叫的組合式模型。傳統的程式結構，如迴圈、例外處理等，在此模型中通常不再有效。
*   不同的 API。通常需要學習全新的 API，例如 `thenCompose` 或 `thenAccept`，這些 API 也可能因平台而異。
*   特定的回傳類型。回傳類型不再是我們所需的實際資料，而是回傳一個新的類型 `Promise`，需要進行內部檢視（introspected）。
*   錯誤處理可能很複雜。錯誤的傳播和鏈式處理並不總是直接的。

## 響應式擴充功能

響應式擴充功能（Reactive Extensions, Rx）由 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) 引入 C#。雖然它確實被用於 .NET 平台，但在 Netflix 將其移植到 Java 並命名為 RxJava 之前，它並未真正普及。從那時起，許多版本已提供給各種平台，包括 JavaScript (RxJS)。

Rx 背後的理念是轉向所謂的 `可觀察的串流（observable streams）`，我們現在將資料視為串流（無限量的資料），並且這些串流可以被觀察。實際應用中，Rx 只是 [觀察者模式（Observer Pattern）](https://en.wikipedia.org/wiki/Observer_pattern) 的一系列擴充，它允許我們對資料進行操作。

在方法上，它與期物（Futures）非常相似，但可以將期物視為回傳一個離散元素，而 Rx 則回傳一個串流。然而，與之前的方法類似，它也引入了一種全新的程式設計模型思維方式，其著名說法是：

> 「一切皆為串流，且皆可觀察」

這意味著解決問題的不同方式，並且與我們習慣編寫同步程式碼的方式有相當大的轉變。相對於期物的一個好處是，鑑於它已被移植到許多平台，無論我們使用 C#、Java、JavaScript 或任何其他提供 Rx 的語言，通常都能獲得一致的 API 體驗。

此外，Rx 確實引入了一種在錯誤處理方面更為優雅的方法。

## 協程

Kotlin 處理非同步程式碼的方法是使用協程（coroutines），這是一種可暫停運算（suspendable computations）的概念，即一個函式可以在某個時間點暫停執行，並在之後恢復。

然而，協程的其中一個好處是，對於開發者而言，編寫非阻塞程式碼本質上與編寫阻塞程式碼相同。程式設計模型本身並沒有真正改變。

例如，請看以下程式碼：

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

這段程式碼將啟動一個長時間執行的操作，而不會阻塞主執行緒。`preparePost` 被稱為「可暫停函式（suspendable function）」，因此在其前面加上了 `suspend` 關鍵字。如上所述，這意味著該函式將執行、暫停執行並在某個時間點恢復。

*   函式簽章完全保持不變。唯一的區別是增加了 `suspend` 關鍵字。然而，回傳類型是我們想要回傳的類型。
*   程式碼仍然像編寫同步程式碼一樣，自上而下地編寫，除了使用一個名為 `launch` 的函式（本質上是啟動協程，這在其他教程中會涵蓋）之外，無需任何特殊語法。
*   程式設計模型和 API 保持不變。我們可以繼續使用迴圈、例外處理等，而無需學習一套全新的 API。
*   它是平台獨立的。無論我們針對 JVM、JavaScript 還是任何其他平台，我們編寫的程式碼都是相同的。在底層，編譯器會負責將其適應於每個平台。

協程並不是一個新概念，更不是由 Kotlin 發明的。它們已經存在了數十年，並在 Go 等其他程式語言中很受歡迎。然而，重要的是要注意，它們在 Kotlin 中的實現方式，大多數功能都委託給了函式庫。事實上，除了 `suspend` 關鍵字之外，沒有其他關鍵字被添加到語言中。這與 C# 等將 `async` 和 `await` 作為語法一部分的語言有所不同。對於 Kotlin 來說，這些只是函式庫函式。

欲了解更多資訊，請參閱 [協程參考](coroutines-overview.md)。