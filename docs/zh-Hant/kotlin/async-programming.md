[//]: # (title: 非同步編程技術)

數十年來，身為開發者，我們一直面臨著一個待解決的問題：如何防止應用程式阻塞。無論是開發桌面、行動還是伺服器端應用程式，我們都希望避免讓使用者等待，更不希望造成可能阻礙應用程式擴展的瓶頸。

為了解決這個問題，有許多方法應運而生，包括：

* [執行緒](#threading)
* [回呼](#callbacks)
* [期約、承諾與其他](#futures-promises-and-others)
* [反應式擴充功能](#reactive-extensions)
* [協程](#coroutines)

在解釋協程是什麼之前，讓我們先簡單回顧一下其他解決方案。

## 執行緒

執行緒無疑是目前最廣為人知、用於避免應用程式阻塞的方法。

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

在上面的程式碼中，假設 `preparePost` 是一個長時間執行的程序，因此會阻塞使用者介面。我們可以做的是在單獨的執行緒中啟動它。這將允許我們避免使用者介面阻塞。這是一種非常常見的技術，但存在一系列缺點：

* 執行緒的開銷不小。執行緒需要上下文切換，這會耗費資源。
* 執行緒不是無限的。可以啟動的執行緒數量受底層作業系統限制。在伺服器端應用程式中，這可能會導致嚴重的瓶頸。
* 執行緒並非總是可用。某些平台，例如 JavaScript 甚至不支援執行緒。
* 執行緒不易處理。調試執行緒和避免競爭條件是多執行緒編程中常見的問題。

## 回呼

使用回呼，其概念是將一個函式作為參數傳遞給另一個函式，並在程序完成後調用該函式。

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

這原則上感覺是一個更優雅的解決方案，但再次面臨多個問題：

* 巢狀回呼的困難。通常，作為回呼使用的函式，最終常常需要自己的回呼。這導致一系列巢狀回呼，進而使程式碼難以理解。由於這些深度巢狀回呼的縮排會形成三角形形狀，這種模式常被稱為「回呼地獄」或「[厄運金字塔](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))」。
* 錯誤處理複雜。巢狀模型使得錯誤處理和傳播變得有些複雜。

回呼在事件循環架構（例如 JavaScript）中相當常見，但即便在這些地方，人們通常也已轉向使用其他方法，例如承諾（Promises）或反應式擴充功能。

## 期約、承諾與其他

期約或承諾（根據語言或平台可能使用其他術語）背後的理念是，當我們發出呼叫時，我們會被「承諾」在某個時間點該呼叫將返回一個 `Promise` 物件，然後我們就可以對其進行操作。

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

這種方法要求我們的編程方式進行一系列改變，特別是：

* 不同的編程模型。與回呼類似，編程模型從自上而下的命令式方法轉向帶有鏈式呼叫的組合式模型。傳統的程式結構，例如迴圈、例外處理等，在此模型中通常不再有效。
* 不同的 API。通常需要學習全新的 API，例如 `thenCompose` 或 `thenAccept`，這些 API 也可能因平台而異。
* 特定的返回型別。返回型別不再是我們所需的實際資料，而是返回一個必須內省的新型別 `Promise`。
* 錯誤處理可能很複雜。錯誤的傳播和鏈接並不總是那麼簡單明瞭。

## 反應式擴充功能

反應式擴充功能（Rx）由 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) 引入 C#。雖然它確實被用於 .NET 平台，但直到 Netflix 將其移植到 Java 並命名為 RxJava，它才真正普及。從那以後，許多平台都提供了大量的移植版本，包括 JavaScript (RxJS)。

Rx 背後的理念是轉向所謂的「可觀察流」（`observable streams`），我們現在將資料視為流（無限量的資料），並且這些流可以被觀察。實際上，Rx 只是[觀察者模式](https://en.wikipedia.org/wiki/Observer_pattern)的一系列擴充功能，允許我們對資料進行操作。

在方法上，它與期約（Futures）非常相似，但可以將期約視為返回一個離散元素，而 Rx 則返回一個流。然而，與前述方法類似，它也引入了一種全新的編程模型思維方式，著名的措辭是

    "一切皆為流，且皆可觀察"
    
這意味著解決問題的不同方式，以及與我們編寫同步程式碼時習慣的方式有著相當顯著的轉變。與期約（Futures）相比，一個好處是，鑑於它已移植到如此多的平台，無論我們使用 C#、Java、JavaScript 或任何其他可用 Rx 的語言，通常都能找到一致的 API 體驗。

此外，Rx 確實引入了一種相對更佳的錯誤處理方法。

## 協程

Kotlin 處理非同步程式碼的方法是使用協程，這是可暫停計算（suspendable computations）的概念，即一個函式可以在某個點暫停其執行並在稍後恢復。

然而，協程的一個優點是，對於開發者而言，編寫非阻塞程式碼與編寫阻塞程式碼本質上相同。編程模型本身並沒有真正改變。

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

這段程式碼將啟動一個長時間運行的操作，而不會阻塞主執行緒。`preparePost` 是一個所謂的「可暫停函式」（`suspendable function`），因此其前面帶有關鍵字 `suspend`。正如前所述，這意味著函式將執行、暫停執行並在某個時間點恢復。

* 函式簽名保持完全相同。唯一的區別是加入了 `suspend`。然而，返回型別是我們希望返回的型別。
* 程式碼仍然像編寫同步程式碼一樣，自上而下地編寫，除了使用一個名為 `launch` 的函式（本質上啟動協程，這在其他教程中會介紹）之外，不需要任何特殊語法。
* 編程模型和 API 保持不變。我們可以繼續使用迴圈、例外處理等，無需學習一整套新的 API。
* 它與平台無關。無論我們目標是 JVM、JavaScript 還是任何其他平台，我們編寫的程式碼都是相同的。在底層，編譯器會負責將其適應於每個平台。

協程並不是一個新概念，更不是由 Kotlin 發明。它們已經存在數十年，並在 Go 等一些其他編程語言中很受歡迎。然而，值得注意的是，它們在 Kotlin 中的實現方式，大部分功能都委託給了函式庫。事實上，除了 `suspend` 關鍵字之外，沒有其他關鍵字被添加到語言中。這與 C# 等將 `async` 和 `await` 作為語法一部分的語言有所不同。在 Kotlin 中，這些只是函式庫函式。

欲了解更多資訊，請參閱[協程參考](coroutines-overview.md)。