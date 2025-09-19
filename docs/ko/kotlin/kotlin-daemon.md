[//]: # (title: Kotlin 데몬)

Kotlin 데몬은 빌드 시스템이 컴파일러와 해당 환경을 컴파일 준비 상태로 유지하여 빌드 시간을 단축하는 데 사용할 수 있는 백그라운드 프로세스입니다. 이 접근 방식은 모든 컴파일마다 새 자바 가상 머신(JVM) 인스턴스를 시작하고 컴파일러를 다시 초기화하는 것을 방지하여, 증분 빌드 또는 빈번한 작은 변경 사항에 대한 빌드 시간을 단축합니다.

일부 빌드 시스템은 [Gradle 데몬](https://docs.gradle.org/current/userguide/gradle_daemon.html) 및 [Maven 데몬](https://maven.apache.org/tools/mvnd.html)과 같이 시작 비용을 줄이는 데 도움이 되는 자체 데몬을 가지고 있습니다. 대신 Kotlin 데몬을 사용하면 시작 비용을 절감하는 동시에 빌드 시스템 프로세스를 컴파일러로부터 완전히 격리할 수 있습니다. 이러한 분리는 시스템 설정이 런타임에 변경될 수 있는 동적 환경에서 유용합니다.

Kotlin 데몬은 사용자에게 직접적인 인터페이스를 제공하지 않지만, 빌드 시스템 또는 [빌드 도구 API](build-tools-api.md)를 통해 사용할 수 있습니다.

## Kotlin 데몬 구성

Gradle 또는 Maven용 Kotlin 데몬에 대한 일부 설정을 구성하는 방법이 있습니다.

### 메모리 관리

Kotlin 데몬은 클라이언트와 격리된 자체 메모리 공간을 가진 별도의 프로세스입니다.
기본적으로 Kotlin 데몬은 JVM 프로세스를 시작하는 힙 크기(`-Xmx`)를 상속하려고 시도합니다.

`-Xmx` 및 `-XX:MaxMetaspaceSize`와 같은 특정 메모리 제한을 구성하려면 다음 속성을 사용하십시오.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin.daemon.jvmargs=-Xmx1500m
```

자세한 내용은 [`kotlin.daemon.jvmargs` 속성](gradle-compilation-and-caches.md#kotlin-daemon-jvmargs-property)을 참조하십시오.

</tab>
<tab title="Maven" group-key="maven">

```xml
<kotlin.compiler.daemon.jvmArgs>-Xmx1500m</kotlin.compiler.daemon.jvmArgs>
```

</tab>
</tabs>

### 수명

Kotlin 데몬에는 두 가지 일반적인 수명 전략이 있습니다.

*   **연결된 데몬**: 클라이언트 프로세스가 종료되거나 데몬이 한동안 사용되지 않은 직후 데몬을 종료합니다. 클라이언트가 장기 실행될 때 사용합니다.
*   **분리된 데몬**: 잠재적인 후속 요청을 기다리기 위해 데몬을 더 오랫동안 활성 상태로 유지합니다. 클라이언트가 단기 실행될 때 사용합니다.

수명 전략을 구성하려면 다음 옵션을 사용할 수 있습니다.

| 옵션                        | 설명                                                                                             | 기본값  |
| :-------------------------- | :------------------------------------------------------------------------------------------------------- | :------ |
| `autoshutdownIdleSeconds`   | 클라이언트가 여전히 연결되어 있을 때 마지막 컴파일 후 데몬이 활성 상태를 유지해야 하는 시간.               | 2시간    |
| `autoshutdownUnusedSeconds` | 새로 시작된 데몬이 사용되지 않을 경우 첫 번째 클라이언트를 기다리는 시간.                                    | 1분     |
| `shutdownDelayMilliseconds` | 모든 클라이언트가 연결 해제된 후 데몬이 종료될 때까지 기다리는 시간.                                           | 1초     |

연결된 데몬 수명 전략을 구성하려면 `autoshutdownIdleSeconds`를 **높은** 값으로 설정하고 `shutdownDelayMilliseconds`를 **낮은** 값으로 설정합니다.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

다음을 `gradle.properties` 파일에 추가하십시오.

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
<tab title="Maven" group-key="maven">

다음 명령을 사용하십시오.

```bash
 mvn package -Dkotlin.daemon.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
</tabs>

분리된 데몬 수명 전략을 구성하려면 `shutdownDelayMilliseconds`를 **높은** 값으로 설정합니다.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

다음을 `gradle.properties` 파일에 추가하십시오.

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=shutdownDelayMilliseconds=7200
```

</tab>
<tab title="Maven" group-key="maven">

다음 속성을 `pom.xml` 파일에 추가하십시오.

```xml
<kotlin.compiler.daemon.shutdownDelayMs>7200</kotlin.compiler.daemon.shutdownDelayMs>
```

</tab>
</tabs>