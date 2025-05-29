[//]: # (title: Kotlin과 OSGi)

Kotlin 프로젝트에서 Kotlin [OSGi](https://www.osgi.org/) 지원을 활성화하려면, 일반 Kotlin 라이브러리 대신 `kotlin-osgi-bundle`을 포함하세요. `kotlin-osgi-bundle`에는 이 모든 것이 이미 포함되어 있으므로, `kotlin-runtime`, `kotlin-stdlib`, `kotlin-reflect` 종속성을 제거하는 것이 좋습니다. 또한 외부 Kotlin 라이브러리가 포함된 경우에도 주의를 기울여야 합니다. 대부분의 일반 Kotlin 종속성은 OSGi-ready가 아니므로, 이를 사용하지 말고 프로젝트에서 제거해야 합니다.

## Maven

Maven 프로젝트에 Kotlin OSGi 번들을 포함하려면:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

외부 라이브러리에서 표준 라이브러리를 제외하려면 (참고: "별표 제외(`*`)"는 Maven 3에서만 작동합니다):

```xml
<dependency>
    <groupId>some.group.id</groupId>
    <artifactId>some.library</artifactId>
    <version>some.library.version</version>

    <exclusions>
        <exclusion>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>*</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

## Gradle

Gradle 프로젝트에 `kotlin-osgi-bundle`을 포함하려면:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation(kotlin("osgi-bundle"))
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation "org.jetbrains.kotlin:kotlin-osgi-bundle:%kotlinVersion%"
}
```

</tab>
</tabs>

전이적 종속성으로 제공되는 기본 Kotlin 라이브러리를 제외하려면 다음 접근 방식을 사용할 수 있습니다:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
dependencies {
    implementation("some.group.id:some.library:someversion") {
        exclude(group = "org.jetbrains.kotlin")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
dependencies {
    implementation('some.group.id:some.library:someversion') {
        exclude group: 'org.jetbrains.kotlin'
    }
}
```

</tab>
</tabs>

## FAQ

### 왜 모든 Kotlin 라이브러리에 필요한 매니페스트 옵션을 추가하지 않나요?

OSGi 지원을 제공하는 가장 선호되는 방식이긴 하지만, 아쉽게도 현재로서는 쉽게 제거할 수 없는 소위 ["패키지 분할(package split) 문제"](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999) 때문에 불가능하며, 현재로서는 그러한 큰 변경이 계획되어 있지 않습니다. `Require-Bundle` 기능이 있지만, 이 역시 최선의 옵션이 아니며 사용이 권장되지 않습니다. 따라서 OSGi를 위한 별도의 아티팩트를 만들기로 결정했습니다.