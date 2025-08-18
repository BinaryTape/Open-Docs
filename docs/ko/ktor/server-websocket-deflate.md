[//]: # (title: WebSocket Deflate 확장)

Ktor는 클라이언트 및 서버를 위해 `Deflate` WebSocket 확장 [RFC-7692](https://tools.ietf.org/html/rfc7692)을 구현합니다. 이 확장은 전송 전에 프레임을 투명하게 압축하고, 수신 후에 압축을 해제할 수 있습니다. 많은 양의 텍스트 데이터를 전송하는 경우 이 확장을 활성화하는 것이 유용합니다.

## 설치

이 확장을 사용하려면 먼저 설치해야 합니다. 이를 위해 `extensions` 블록에서 `install` 메서드를 사용할 수 있습니다.

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

### 고급 구성 매개변수

#### 컨텍스트 인계

클라이언트(및 서버)가 압축 윈도우를 사용해야 하는지 여부를 지정합니다. 이 매개변수들을 활성화하면 단일 세션당 할당되는 공간의 양이 줄어듭니다. 참고로 `java.util.zip.Deflater` API의 제한으로 인해 윈도우 크기는 구성할 수 없습니다. 값은 `15`로 고정됩니다.

```kotlin
clientNoContextTakeOver = false

serverNoContextTakeOver = false
```

이 매개변수들은 [RFC-7692 섹션 7.1.1](https://tools.ietf.org/html/rfc7692#section-7.1.1)에 설명되어 있습니다.

#### 압축 조건 지정

압축 조건을 명시적으로 지정하려면 `compressIf` 메서드를 사용할 수 있습니다. 예를 들어, 텍스트만 압축하려면:

```kotlin
compressIf { frame -> 
    frame is Frame.Text
}
```
`compressIf`에 대한 모든 호출은 압축이 수행되기 전에 평가됩니다.

#### 프로토콜 목록 세부 조정

전송할 프로토콜 목록은 `configureProtocols` 메서드를 사용하여 필요에 따라 편집할 수 있습니다.

```kotlin
configureProtocols { protocols ->
    protocols.clear()
    protocols.add(...)
}
```