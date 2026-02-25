[//]: # (title: Kotlin 및 OSGi)

Kotlin 프로젝트에서 [OSGi](https://www.osgi.org/) 지원을 활성화하려면 일반적인 Kotlin 라이브러리 대신 `kotlin-osgi-bundle`을 포함하세요. `kotlin-osgi-bundle`에 이미 모든 라이브러리가 포함되어 있으므로 `kotlin-runtime`, `kotlin-stdlib`, `kotlin-reflect` 의존성은 제거하는 것이 좋습니다. 외부 Kotlin 라이브러리가 포함되는 경우에도 주의를 기울여야 합니다. 대부분의 일반적인 Kotlin 의존성은 OSGi를 지원하지 않으므로, 이를 사용하지 말아야 하며 프로젝트에서 제거해야 합니다.

## Maven

Maven 프로젝트에 Kotlin OSGi 번들을 포함하려면 다음과 같이 설정합니다:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-osgi-bundle</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

외부 라이브러리에서 표준 라이브러리를 제외하려면 다음과 같이 설정합니다 (와일드카드를 이용한 제외("star exclusion")는 Maven 3에서만 작동함에 유의하세요):

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

Gradle 프로젝트에 `kotlin-osgi-bundle`을 포함하려면 다음과 같이 설정합니다:

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

전이 의존성(transitive dependencies)으로 제공되는 기본 Kotlin 라이브러리를 제외하려면 다음과 같은 방법을 사용할 수 있습니다:

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

그것이 OSGi 지원을 제공하는 가장 선호되는 방법임에도 불구하고, 안타깝게도 현재로서는 쉽게 해결할 수 없는 소위 ["패키지 분할(package split)" 문제](https://docs.osgi.org/specification/osgi.core/7.0.0/framework.module.html#d0e5999)로 인해 불가능하며, 현재 이러한 큰 변화는 계획되어 있지 않습니다. `Require-Bundle` 기능이 있긴 하지만 이 또한 최선의 옵션이 아니며 사용이 권장되지 않습니다. 따라서 OSGi를 위한 별도의 아티팩트를 만들기로 결정되었습니다.