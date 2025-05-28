[//]: # (title: WebSocket Deflate拡張)

Ktorは、クライアントおよびサーバー向けに`Deflate` WebSocket拡張 [RFC-7692](https://tools.ietf.org/html/rfc7692) を実装しています。この拡張は、送信前にフレームを透過的に圧縮し、受信後に解凍できます。大量のテキストデータを送信する場合、この拡張を有効にすると便利です。

## インストール

この拡張を使用するには、まずインストールする必要があります。そのためには、`extensions`ブロック内で`install`メソッドを使用します:

```kotlin
// For client and server
install(WebSockets) {
    extensions {
        install(WebSocketDeflateExtension) {
            /**
             * Compression level to use for [java.util.zip.Deflater].
             */
            compressionLevel = Deflater.DEFAULT_COMPRESSION

            /**
             * Prevent compressing small outgoing frames.
             */
            compressIfBiggerThan(bytes = 4 * 1024)
        }
    }
}
```

### 高度な設定

#### コンテキストの引き継ぎ

クライアント（およびサーバー）が圧縮ウィンドウを使用するかどうかを指定します。これらのパラメーターを有効にすると、単一セッションごとに割り当てられるスペースの量を削減します。なお、`java.util.zip.Deflater` APIの制限によりウィンドウサイズは設定できません。値は`15`に固定されています。

```kotlin
clientNoContextTakeOver = false

serverNoContextTakeOver = false
```

これらのパラメーターは、[RFC-7692 Section 7.1.1](https://tools.ietf.org/html/rfc7692#section-7.1.1)で説明されています。

#### 圧縮条件の指定

圧縮条件を明示的に指定するには、`compressIf`メソッドを使用できます。例えば、テキストのみを圧縮する場合:

```kotlin
compressIf { frame -> 
    frame is Frame.Text
}
```
`compressIf`へのすべての呼び出しは、圧縮が行われる前に評価されます。

#### プロトコルリストの微調整

送信するプロトコルリストは、`configureProtocols`メソッドを使用して必要に応じて編集できます:

```kotlin
configureProtocols { protocols ->
    protocols.clear()
    protocols.add(...)
}
```