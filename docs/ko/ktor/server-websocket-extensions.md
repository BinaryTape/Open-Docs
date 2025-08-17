[//]: # (title: WebSocket 확장 API)

Ktor WebSocket API는 자체 확장 기능([RFC-7692](https://tools.ietf.org/html/rfc7692)와 같은) 또는 모든 사용자 지정 확장 기능을 작성하는 것을 지원합니다.

## 확장 기능 설치

확장을 설치하고 구성하려면 `extensions`와 `install`이라는 두 가지 메서드를 다음 방식으로 사용할 수 있습니다.
```kotlin
install(WebSockets) {
    extensions { /* WebSocketExtensionConfig.() -> Unit */
        install(MyWebSocketExtension) { /* MyWebSocketExtensionConfig.() -> Unit */
        /* 선택적 확장 구성. */ 
        }
    }
}
```

확장은 설치 순서대로 사용됩니다.

## 확장 기능이 협상되었는지 확인

설치된 모든 확장 기능은 협상 프로세스를 거치며, 성공적으로 협상된 확장 기능은 요청 중에 사용됩니다. 현재 세션에 사용되는 모든 확장 기능 목록과 함께 `WebSocketSession.extensions: : List<WebSocketExtension<*>>` 속성을 사용할 수 있습니다.

확장 기능이 사용 중인지 확인하는 두 가지 메서드는 `WebSocketSession.extension` 및 `WebSocketSession.extensionOrNull`입니다.
```kotlin
webSocket("/echo") {
    val myExtension = extension(MyWebSocketExtension) // `MyWebSocketExtension`이 협상되지 않으면 예외가 발생합니다
    // or
    val myExtension = extensionOrNull(MyWebSocketExtension) ?: close() // `MyWebSocketExtension`이 협상되지 않으면 세션을 닫습니다
}
```

## 새 확장 기능 작성

새 확장 기능을 구현하기 위한 두 가지 인터페이스는 `WebSocketExtension<ConfigType: Any>` 및 `WebSocketExtensionFactory<ConfigType : Any, ExtensionType : WebSocketExtension<ConfigType>>`입니다. 단일 구현으로 클라이언트와 서버 모두에서 작동할 수 있습니다.

아래는 간단한 프레임 로깅 확장 기능을 구현하는 방법의 예시입니다.

```kotlin
class FrameLoggerExtension(val logger: Logger) : WebSocketExtension<FrameLogger.Config> {
```

플러그인은 필드와 메서드의 두 가지 그룹을 가집니다. 첫 번째 그룹은 확장 협상을 위한 것입니다.

```kotlin
    /** 협상을 위해 클라이언트 요청으로 전송될 프로토콜 목록 **/
    override val protocols: List<WebSocketExtensionHeader> = emptyList()
   
    /** 
      * 이 메서드는 서버에 대해 호출되며 클라이언트로부터의 `requestedProtocols`를 처리합니다.
      * 결과적으로 서버가 사용하기로 동의한 확장 기능 목록을 반환합니다.
      */
    override fun serverNegotiation(requestedProtocols: List<WebSocketExtensionHeader>): List<WebSocketExtensionHeader> {
        logger.log("Server negotiation")
        return emptyList()
    }

    /**
      * 이 메서드는 `serverNegotiation`에 의해 생성된 프로토콜 목록과 함께 클라이언트에서 호출됩니다. 이 확장 기능들을 사용해야 할지 결정합니다. 
      */ 
    override fun clientNegotiation(negotiatedProtocols: List<WebSocketExtensionHeader>): Boolean {
        logger.log("Client negotiation")
        return true
    }

```

두 번째 그룹은 실제 프레임 처리를 위한 공간입니다. 메서드는 프레임을 받아 필요한 경우 새로운 처리된 프레임을 생성합니다.

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

몇 가지 구현 세부 사항도 있습니다. 플러그인은 `Config`와 원본 `factory`에 대한 참조를 가집니다.

```kotlin
    class Config {
        lateinit var logger: Logger
    }

    /**
    * 현재 확장 인스턴스를 생성할 수 있는 팩토리. 
    */
    override val factory: WebSocketExtensionFactory<Config, FrameLogger> = FrameLoggerExtension
```

팩토리는 일반적으로 컴패니언 객체에서 구현됩니다(일반 플러그인과 유사).

```kotlin
    companion object : WebSocketExtensionFactory<Config, FrameLogger> {
        /* 설치된 확장 인스턴스를 찾기 위한 키 */
        override val key: AttributeKey<FrameLogger> = AttributeKey("frame-logger")

        /** 점유된 rsv 비트 목록.
         * 확장이 비트를 점유하면 다른 설치된 확장 기능에서 사용될 수 없습니다. 이 비트들은 플러그인 충돌(여러 압축 플러그인 설치 방지)을 방지하는 데 사용됩니다. RFC를 사용하여 플러그인을 구현하는 경우, rsv 점유 비트가 거기에 참조되어야 합니다.
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
```