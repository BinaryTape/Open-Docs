[//]: # (title: Kotlin 데몬)

Kotlin 데몬(Kotlin daemon)은 컴파일러와 그 환경을 준비된 상태로 유지함으로써 빌드 시스템의 빌드 시간을 단축하는 데 사용되는 백그라운드 프로세스입니다. 이 방식을 사용하면 매번 컴파일할 때마다 새로운 JVM(Java Virtual Machine) 인스턴스를 시작하고 컴파일러를 다시 초기화할 필요가 없으므로, 증분 빌드(incremental builds)나 잦은 소규모 변경 시 빌드 시간을 줄일 수 있습니다.

일부 빌드 시스템은 [Gradle 데몬](https://docs.gradle.org/current/userguide/gradle_daemon.html)이나 [Maven 데몬](https://maven.apache.org/tools/mvnd.html)과 같이 시작 비용을 줄이는 자체 데몬을 가지고 있습니다. Kotlin 데몬을 사용하면 시작 비용을 줄이는 동시에 빌드 시스템 프로세스를 컴파일러로부터 완전히 격리할 수 있습니다. 이러한 격리는 시스템 설정이 런타임에 변경될 수 있는 동적인 환경에서 유용합니다.

Kotlin 데몬은 사용자에게 직접 노출되는 인터페이스는 없지만, 빌드 시스템이나 [빌드 도구 API(build tools API)](build-tools-api.md)를 통해 사용할 수 있습니다.

## Kotlin 데몬 설정

Gradle 또는 Maven에서 Kotlin 데몬의 일부 설정을 구성하는 방법이 있습니다.

### 메모리 관리

Kotlin 데몬은 클라이언트와 격리된 자체 메모리 공간을 가진 별도의 프로세스입니다. 기본적으로 Kotlin 데몬은 이를 실행한 JVM 프로세스의 힙 크기(`-Xmx`)를 상속받으려고 시도합니다.

`-Xmx` 및 `-XX:MaxMetaspaceSize`와 같은 특정 메모리 제한을 설정하려면 다음 속성을 사용하세요.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin.daemon.jvmargs=-Xmx1500m
```

자세한 내용은 [`kotlin.daemon.jvmargs` 속성](gradle-compilation-and-caches.md#kotlin-daemon-jvmargs-property)을 참조하세요.

</tab>
<tab title="Maven" group-key="maven">

```xml
<kotlin.compiler.daemon.jvmArgs>-Xmx1500m</kotlin.compiler.daemon.jvmArgs>
```

</tab>
</tabs>

### 수명 주기(Lifetime)

Kotlin 데몬에는 두 가지 일반적인 수명 주기 전략이 있습니다.

* **연결된 데몬(Attached daemon)**: 클라이언트 프로세스가 종료된 직후나 데몬이 한동안 사용되지 않으면 데몬을 종료합니다. 클라이언트가 오래 실행되는 경우에 사용합니다.
* **분리된 데몬(Detached daemon)**: 후속 요청이 있을 가능성에 대비하여 데몬을 더 오래 유지합니다. 클라이언트의 수명이 짧은 경우에 사용합니다.

수명 주기 전략을 구성하려면 다음 옵션을 사용할 수 있습니다.

| 옵션 | 설명 | 기본값 |
|-----------------------------|----------------------------------------------------------------------------------------------------|---------------|
| `autoshutdownIdleSeconds`   | 클라이언트가 여전히 연결되어 있을 때, 마지막 컴파일 후 데몬이 유지되는 시간입니다. | 2시간 |
| `autoshutdownUnusedSeconds` | 새로 시작된 데몬이 사용되지 않을 경우 종료되기 전까지 첫 번째 클라이언트를 기다리는 시간입니다. | 1분 |
| `shutdownDelayMilliseconds` | 모든 클라이언트의 연결이 끊긴 후 데몬이 종료될 때까지 대기하는 시간입니다. | 1초 |

연결된 데몬 수명 주기 전략을 구성하려면 `autoshutdownIdleSeconds`를 **높은** 값으로 설정하고 `shutdownDelayMilliseconds`를 **낮은** 값으로 설정하세요.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

`gradle.properties` 파일에 다음을 추가하세요.

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
<tab title="Maven" group-key="maven">

다음 명령어를 사용하세요.

```bash
 mvn package -Dkotlin.daemon.options=autoshutdownIdleSeconds=7200,shutdownDelayMilliseconds=1000
```

</tab>
</tabs>

분리된 데몬 수명 주기 전략을 구성하려면 `shutdownDelayMilliseconds`를 **높은** 값으로 설정하세요.

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

`gradle.properties` 파일에 다음을 추가하세요.

```none
org.gradle.jvmargs=-Dkotlin.daemon.jvm.options=shutdownDelayMilliseconds=7200
```

</tab>
<tab title="Maven" group-key="maven">

`pom.xml` 파일에 다음 속성을 추가하세요.

```xml
<kotlin.compiler.daemon.shutdownDelayMs>7200</kotlin.compiler.daemon.shutdownDelayMs>
```

</tab>
</tabs>