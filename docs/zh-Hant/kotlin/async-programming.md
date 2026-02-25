[//]: # (title: 非同步程式設計技術)

數十年來，身為開發人員，我們一直面臨著一個需要解決的問題 —— 如何防止我們的應用程式發生阻塞（blocking）。無論我們是在開發桌面、行動裝置甚至是伺服器端應用程式，我們都希望避免讓使用者等待，或者更糟的是造成會阻礙應用程式擴充（scaling）的瓶頸。

目前已有許多解決此問題的方法，包括：

* [執行緒](#threading)
* 回呼（Callbacks）
* [future、promise 及其他](#futures-promises-and-others)
* [Reactive Extensions](#reactive-extensions)
* [協同程式](#coroutines)

在解釋什麼是協同程式之前，讓我們簡要地回顧一些其他的解決方案。

## 執行緒

到目前為止，執行緒（thread）可能是避免應用程式阻塞最廣為人知的方法。

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // 進行請求並因此阻塞主執行緒
    return token
}
```

讓我們假設在上述程式碼中，`preparePost` 是一個耗時較長的處理程序，因此會阻塞使用者介面。我們可以做的是在一個單獨的執行緒中啟動它。這樣就能讓我們避免 UI 發生阻塞。這是一種非常常見的技術，但有一系列缺點：

* 執行緒並不便宜。執行緒需要內文切換（context switch），這是相當耗費資源的。
* 執行緒並非無限。可以啟動的執行緒數量受限於底層的作業系統。在伺服器端應用程式中，這可能會造成主要的瓶頸。
* 執行緒並非總是可用。某些平台（例如 JavaScript）甚至不支援執行緒。
* 執行緒並不簡單。在多執行緒程式設計中，偵錯執行緒以及避免競爭條件（race conditions）是我們經常遭遇的問題。

## 回呼

使用回呼（callback）的想法是將一個函式作為參數傳遞給另一個函式，並在處理程序完成後呼叫此函式。

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token -> 
        submitPostAsync(token, item) { post -> 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) -> Unit) {
    // 發起請求並立即回傳
    // 安排回呼在稍後被呼叫
}
```

原則上這感覺是一個更優雅的解決方案，但同樣也存在幾個問題：

* 巢狀回呼的難度。通常作為回呼使用的函式，最後往往也需要自己的回呼。這導致了一系列的巢狀回呼，進而產生難以理解的程式碼。這種模式通常被稱為回呼地獄（callback hell），或者由於這些深層巢狀回呼產生的縮排所構成的三角形形狀而被稱為[末日金字塔](https://en.wikipedia.org/wiki/Pyramid_of_doom_(programming))（pyramid of doom）。
* 錯誤處理很複雜。巢狀模型使得錯誤處理和錯誤傳遞變得更加複雜。

回呼在 JavaScript 等事件迴圈（event-loop）架構中非常常見，但即便在那裡，人們通常也已經轉向使用其他方法，例如 promise 或 Reactive Extensions。

## future、promise 及其他

future 或 promise（根據語言或平台的不同，可能會使用其他術語）背後的想法是，當我們發起呼叫時，我們被 _承諾_（promised）在某個時間點該呼叫將回傳一個 `Promise` 物件，然後我們就可以對其進行操作。

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
    // 發起請求並回傳一個稍後完成的 promise
    return promise 
}
```

這種方法需要對我們的編碼方式進行一系列更改，特別是：

* 不同的程式設計模型。與回呼類似，程式設計模型從由上而下的命令式方法轉變為具有鏈式呼叫的組合式模型。傳統的程式結構（如迴圈、例外處理等）在此模型中通常不再有效。
* 不同的 API。通常需要學習全新的 API，例如 `thenCompose` 或 `thenAccept`，這些 API 在不同平台上也可能有所不同。
* 特定的回傳型別。傳回型別從我們需要的實際資料轉變為需要進行反省（introspected）的新型別 `Promise`。
* 錯誤處理可能很複雜。錯誤的傳遞和鏈接並不總是直觀的。

## Reactive Extensions

Reactive Extensions (Rx) 是由 [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)) 引入到 C# 的。雖然它確實被用在 .NET 平台上，但直到 Netflix 將其移植到 Java 並命名為 RxJava，它才真正被主流採用。從那時起，許多移植版被提供給了各種平台，包括 JavaScript (RxJS)。

Rx 背後的想法是轉向所謂的 `observable streams`，藉此我們現在將資料視為串流（無限量的資料），且這些串流可以被觀察。就實際情況而言，Rx 只是觀察者模式（Observer Pattern）加上一系列擴充，讓我們可以對資料進行操作。

在方法上，它與 future 非常相似，但我們可以將 future 視為回傳一個離散元素，而 Rx 則回傳一個串流。然而，與前者類似，它也引入了一種全新的程式設計模型思考方式，正如那句名言所說：

    「一切皆為串流，且皆可觀察」
    
這意味著處理問題的方法不同，且與我們在編寫同步程式碼時的習慣相比，有著顯著的轉變。與 future 相比的一個優點是，由於它被移植到許多平台，通常無論我們使用什麼（無論是 C#、Java、JavaScript 或任何其他可以使用 Rx 的語言），都能找到一致的 API 體驗。

此外，Rx 確實為錯誤處理引入了一種更完善的方法。

## 協同程式

Kotlin 處理非同步程式碼的方法是使用協同程式（coroutine），這是一種可掛起運算（suspendable computations）的想法，即函式可以在某個點掛起其執行，並在稍後恢復。

然而，協同程式的優點之一是對於開發人員來說，編寫非阻塞程式碼與編寫阻塞程式碼基本上是相同的。程式設計模型本身並未真正改變。

以以下程式碼為例：

```kotlin
fun postItem(item: Item) {
    launch {
        val token = preparePost()
        val post = submitPost(token, item)
        processPost(post)
    }
}

suspend fun preparePost(): Token {
    // 發起請求並掛起協同程式
    return suspendCoroutine { /* ... */ } 
}
```

這段程式碼將啟動一個耗時較長的作業，而不會阻塞主執行緒。`preparePost` 被稱為 `suspendable function`，因此其前綴有 `suspend` 關鍵字。如上所述，這意味著該函式將執行、暫停執行並在未來的某個時間點恢復。

* 函式簽章（signature）保持完全相同。唯一的區別是添加了 `suspend`。然而，傳回型別是我們想要回傳的型別。
* 程式碼的編寫方式仍然像是我們在編寫同步程式碼一樣，由上而下，除了使用一個名為 `launch` 的函式（基本上用於啟動協同程式，在其他教學中會詳細介紹）之外，不需要任何特殊的語法。
* 程式設計模型和 API 保持不變。我們可以繼續使用迴圈、例外處理等，且不需要學習一套全新的 API。
* 它是平台無關的。無論我們的目標是 JVM、JavaScript 還是任何其他平台，我們編寫的程式碼都是相同的。編譯器會在底層負責將其調整至各個平台。

協同程式並不是一個新概念，更不是由 Kotlin 發明的。它們已經存在了數十年，並在 Go 等其他程式語言中非常流行。但需要注意的是，在 Kotlin 的實作方式中，大部分功能都委託給了程式庫。事實上，除了 `suspend` 關鍵字之外，語言中沒有添加其他關鍵字。這與 C# 等將 `async` 和 `await` 作為語法一部分的語言有所不同。在 Kotlin 中，這些只是程式庫函式。

若要了解更多，請參閱 [協同程式參考 (Coroutines reference)](coroutines-overview.md)。