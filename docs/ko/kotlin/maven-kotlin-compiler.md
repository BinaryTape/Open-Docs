[//]: # (title: Maven 프로젝트용 Kotlin 컴파일러 구성)

`kotlin-maven-plugin`을 사용하면 Maven 프로젝트의 Kotlin 컴파일러를 구성할 수 있습니다.
컴파일러 옵션을 지정하고, 실행 전략을 선택하며, 증분 컴파일(incremental compilation)을 활성화할 수 있습니다.

## 컴파일러 옵션 지정

Kotlin Maven 플러그인 노드의 `<configuration>` 섹션 내 요소로 컴파일러에 대한 추가 옵션과 인수를 지정할 수 있습니다.

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    <version>${kotlin.version}</version>
    <extensions>true</extensions> <!-- 빌드에 실행(execution)을 자동으로 추가하려는 경우 -->
    <executions>...</executions>
    <configuration>
        <nowarn>true</nowarn> <!-- 경고 비활성화 -->
        <args>
            <arg>-Xjsr305=strict</arg> <!-- JSR-305 어노테이션에 대해 엄격 모드 활성화 -->
            ...
        </args>
    </configuration>
</plugin>
```

대부분의 옵션은 속성(property)을 통해 구성할 수도 있습니다.

```xml
<project>
    <properties>
        <kotlin.compiler.languageVersion>%languageVersion%</kotlin.compiler.languageVersion>
    </properties>
</project>
```

다음 속성들이 지원됩니다:

### JVM 관련 속성

| 이름              | 속성 이름                         | 설명                                                                                          | 가능한 값                                                | 기본값                         |
|-------------------|-----------------------------------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------|--------------------------------|
| `nowarn`          |                                   | 경고를 생성하지 않음                                                                          | true, false                                              | false                          |
| `languageVersion` | `kotlin.compiler.languageVersion` | 지정된 버전의 Kotlin과 소스 호환성 제공                                                       | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (실험적)        |                                |
| `apiVersion`      | `kotlin.compiler.apiVersion`      | 번들된 라이브러리의 지정된 버전에서 제공하는 선언만 사용하도록 허용                               | "1.9", "2.0", "2.1", "2.2", "2.3", "2.4" (실험적)        |                                |
| `sourceDirs`      |                                   | 컴파일할 소스 파일이 포함된 디렉터리                                                          |                                                          | 프로젝트 소스 루트             |
| `compilerPlugins` |                                   | 활성화된 컴파일러 플러그인                                                                    |                                                          | []                             |
| `pluginOptions`   |                                   | 컴파일러 플러그인 옵션                                                                        |                                                          | []                             |
| `args`            |                                   | 추가 컴파일러 인수                                                                            |                                                          | []                             |
| `jvmTarget`       | `kotlin.compiler.jvmTarget`       | 생성된 JVM 바이트코드의 대상 버전                                                             | "1.8", "9", "10", ..., "25"                              | "%defaultJvmTargetVersion%"    |
| `jdkHome`         | `kotlin.compiler.jdkHome`         | 기본 JAVA_HOME 대신 지정된 위치의 커스텀 JDK를 클래스패스에 포함                              |                                                          |                                |

## 실행 전략 선택

<snippet id="maven-configure-execution-strategy">

기본적으로 Maven은 Kotlin 데몬 컴파일러 실행 전략을 사용합니다. "in process" 전략으로 전환하려면 `pom.xml` 파일에 다음 속성을 설정하세요.

```xml
<properties>
    <kotlin.compiler.daemon>false</kotlin.compiler.daemon>
</properties>
```

</snippet>

다양한 전략에 대한 자세한 내용은 [컴파일러 실행 전략](compiler-execution-strategy.md)을 참조하세요.

## 증분 컴파일 활성화

빌드 속도를 높이려면 `kotlin.compiler.incremental` 속성을 추가하여 증분 컴파일(incremental compilation)을 활성화할 수 있습니다.

```xml
<properties>
    <kotlin.compiler.incremental>true</kotlin.compiler.incremental>
</properties>
```

또는 `-Dkotlin.compiler.incremental=true` 옵션을 사용하여 빌드를 실행하세요.

## 다음 단계는?

[프로젝트 패키징](maven-compile-package.md)