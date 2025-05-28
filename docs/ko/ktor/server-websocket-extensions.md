[//]: # (title: WebSocket 확장 API)

Ktor WebSocket API는 자신만의 확장 기능(extensions)을 작성하는 것을 지원하며(예: [RFC-7692](https://tools.ietf.org/html/rfc7692)와 같은), 또는 사용자 지정 확장 기능도 지원합니다.

## 확장 기능 설치

확장 기능을 설치하고 구성하기 위해, Ktor는 `extensions`와 `install` 두 가지 메서드를 제공하며, 다음과 같이 사용할 수 있습니다:
```kotlin
install(WebSockets) {
    extensions { /* WebSocketExtensionConfig.() -> Unit */
        install(MyWebSocketExtension) { /* MyWebSocketExtensionConfig.() -> Unit */
        /* Optional extension configuration. */ 
        }
    }
}
```

확장 기능은 설치된 순서대로 사용됩니다.

## 확장 기능 협상 여부 확인

설치된 모든 확장 기능은 협상 과정을 거치며, 성공적으로 협상된 확장 기능만 요청 중에 사용됩니다. 현재 세션에 사용되는 모든 확장 기능의 목록은 `WebSocketSession.extensions: List<WebSocketExtension<*>>` 속성을 사용하여 확인할 수 있습니다.

확장 기능이 사용 중인지 확인하는 두 가지 메서드가 있습니다: `WebSocketSession.extension`과 `WebSocketSession.extensionOrNull`입니다:
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // will throw if `MyWebSocketExtension` is not negotiated
    // or
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // will close the session if `MyWebSocketExtension` is not negotiated
}
```

## 새 확장 기능 작성

새 확장 기능을 구현하기 위한 두 가지 인터페이스는 `WebSocketExtension<ConfigType: Any>`와 `WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`입니다. 단일 구현으로 클라이언트와 서버 모두에서 작동할 수 있습니다.

아래는 간단한 프레임 로깅 확장 기능을 어떻게 구현할 수 있는지에 대한 예시입니다:

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

이 플러그인에는 필드와 메서드의 두 가지 그룹이 있습니다. 첫 번째 그룹은 확장 기능 협상을 위한 것입니다:

```kotlin
    /** 협상을 위해 클라이언트 요청에 전송될 프로토콜 목록 **/
    override val protocols: List<WebSocketExtensionHeader> = emptyList()
   
    /** 
      * 이 메서드는 서버에 대해 호출되며 클라이언트의 `requestedProtocols`를 처리합니다.
      * 결과적으로 서버가 사용하기로 동의한 확장 기능 목록을 반환합니다.
      */
    override fun serverNegotiation(requestedProtocols: List<WebSocketExtensionHeader>): List<WebSocketExtensionHeader> {
        logger.log("Server negotiation")
        return emptyList()
    }

    /**
      * 이 메서드는 `serverNegotiation`에 의해 생성된 프로토콜 목록과 함께 클라이언트에서 호출됩니다. 이 확장 기능들을 사용할지 여부를 결정합니다. 
      */ 
    override fun clientNegotiation(negotiatedProtocols: List<WebSocketExtensionHeader>): Boolean {
        logger.log("Client negotiation")
        return true
    }

```

두 번째 그룹은 실제 프레임 처리를 위한 공간입니다. 메서드는 프레임을 받아 필요한 경우 새롭게 처리된 프레임을 생성합니다:

```kotlin
    override fun processOutgoingFrame(frame: Frame): Frame {
        logger.log("Process outgoing frame: $frame")
        return frame
    }

    override fun processIncomingFrame(frame: Frame): Frame {
        logger.log("Process incoming frame: $frame")
        return frame
    }
```

구현 세부 사항도 있습니다: 이 플러그인은 `Config`와 원본 `factory`에 대한 참조를 가집니다.

```kotlin
    class Config {
        lateinit var logger: Logger
    }

    /**
    * 현재 확장 인스턴스를 생성할 수 있는 팩토리입니다. 
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

팩토리는 일반적으로 컴패니언 객체에서 구현됩니다(일반적인 플러그인과 유사하게):

```kotlin
    companion object : WebSocketExtensionFactory<Config, FrameLogger> {
        /* 설치된 확장 인스턴스를 찾기 위한 키 */
        override val key: AttributeKey<FrameLogger> = AttributeKey("frame-logger")

        /** 사용 중인 rsv 비트 목록입니다.
         * 확장 기능이 비트를 점유하면 다른 설치된 확장 기능에서는 사용할 수 없습니다. 이 비트들은 플러그인 충돌(다중 압축 플러그인 설치 방지)을 막는 데 사용됩니다. 특정 RFC를 사용하는 플러그인을 구현하는 경우, rsv 점유 비트가 해당 RFC에 명시되어야 합니다.
         */
        override val rsv1: Boolean = false
        override val rsv2: Boolean = false
        override val rsv3: Boolean = false

       /** 플러그인 인스턴스를 생성합니다. 각 WebSocket 세션에 대해 호출됩니다. **/
        override fun install(config: Config.() -> Unit): FrameLogger {
            return FrameLogger(Config().apply(config).logger)
        }
    }
}