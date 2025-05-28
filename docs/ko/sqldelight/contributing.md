# 기여하기

이 프로젝트에 코드 기여를 원하시면 GitHub에서 [저장소를 포크(fork)](https://docs.github.com/en/get-started/quickstart/contributing-to-projects#forking-a-repository)하고 [풀 리퀘스트(pull request)를 보내는](https://docs.github.com/en/github/collaborating-with-pull-requests/proposing-changes-with-pull-requests/creating-a-pull-request) 방식으로 참여할 수 있습니다.

코드를 제출할 때는 코드가 최대한 읽기 쉽도록 기존 컨벤션과 스타일을 최대한 준수해 주세요.

제출하신 코드가 프로젝트에 반영되기 전에 [개인 기여자 라이선스 계약 (CLA)][1]에 서명해야 합니다.

 [1]: https://spreadsheets.google.com/spreadsheet/viewform?formkey=dDViT2xzUHAwRkI3X3k5Z0lQM091OGc6MQ&ndplr=1
 
## SQLDelight 

SQLDelight 기여를 시작하고 싶다면, SQLDelight의 어떤 부분에 기여하고 싶은지에 따라 아래에서 특정 가이드를 확인하세요. 여전히 확실하지 않다면, 보고 있는 이슈에 막히는 부분을 댓글로 남겨주시면 저희가 그곳에서 답변해 드리거나, 시도하려는 것에 대한 이슈를 생성하여 논의를 시작하세요.

### IDE 플러그인

버그를 수정하거나 IDE를 확장하고 싶다면, 코드 변경은 주로 `sqldelight-idea-plugin` 모듈에서 발생합니다. 변경 사항은 `./gradlew runIde` 태스크를 사용하여 테스트할 수 있으며, `./gradlew runIde --debug-jvm`을 사용하여 실시간 디버그를 할 수 있습니다.

IDE에서 버그를 발견했지만 샘플 프로젝트에서 재현할 수 없다면, IDE를 실시간 디버그할 수 있습니다. 이를 위해 IntelliJ를 두 번째로 설치해야 합니다. [Toolbox](https://www.jetbrains.com/toolbox-app/)를 사용하여 IDE 목록의 하단으로 스크롤하여 다른 버전의 IntelliJ를 선택하는 방식으로 이 작업을 수행할 수 있습니다.

디버거를 사용하려는 IDE에서 SQLDelight 저장소를 체크아웃(check out)한 다음, 새로운 `Remote` 실행 구성을 생성하세요. "Command line arguments for remote JVM"에 이미 `-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005`와 같은 내용이 채워져 있을 것입니다. 해당 값을 복사한 다음, 디버그하려는 IDE를 여세요. `Help -> Edit Custom VM Options`를 선택하고, 열린 파일의 하단에 복사한 줄을 붙여넣으세요. 디버그하려는 IDE를 재시작한 다음, 시작되면 구성을 생성한 IDE를 열고 생성한 원격 구성을 사용하여 디버거를 연결하세요.

IDE 플러그인 구축 및 기능 구현에 대한 더 자세한 정보는 [공식 Jetbrains 문서](https://jetbrains.org/intellij/sdk/docs/reference_guide/custom_language_support.html)를 참조하거나 [Jetbrains Platform Slack](https://blog.jetbrains.com/platform/2019/10/introducing-jetbrains-platform-slack-for-plugin-developers/)에 참여하세요.

### 드라이버

자신만의 드라이버를 생성하는 데 관심이 있다면, SQLDelight 저장소 외부에서 `runtime` 아티팩트(artifact)를 사용하여 그렇게 할 수 있습니다. 드라이버를 테스트하려면 `driver-test`에 의존하고 `DriverTest`와 `TransactionTest`를 확장하여 SQLDelight가 예상하는 대로 작동하는지 확인할 수 있습니다.

#### 비동기 드라이버

비동기 호출을 하는 드라이버는 `runtime-async` 아티팩트(artifact)를 사용하여 구현할 수 있습니다. 

### Gradle

Gradle 문제를 겪고 있다면, `sqldelight-gradle-plugin/src/test`에 있는 다른 폴더들과 유사하게 문제를 재현하는 테스트 픽스처(fixture)를 생성하는 것부터 시작하세요. 수정 방법을 모른다면 이 실패하는 테스트만 포함한 PR을 여는 것도 좋습니다! 테스트 케이스는 매우 환영합니다. 통합 테스트는 SQLite/MySQL/PostgreSQL 등을 실행하고 각 런타임 환경과 SQLDelight를 사용하여 SQL 쿼리를 실행하는 전체 Gradle 프로젝트를 설정하는 방법을 보여줍니다. SQLDelight에서 런타임 문제를 겪고 있다면, 이미 존재하는 통합 테스트에 테스트를 추가하는 것을 고려해 보세요.

### 컴파일러

SQLDelight 컴파일러에는 여러 계층이 있습니다. 코드 생성(codegen)에만 관심이 있다면 (SQL 파싱 제외), `sqldelight-compiler` 모듈에 기여하시면 됩니다. 파서(parser)에 관심이 있다면 [sql-psi](https://github.com/alecstrong/sql-psi)에 기여해야 합니다. SQLDelight는 Kotlin 코드를 생성하기 위해 [kotlinpoet](https://github.com/square/kotlinpoet)를 사용합니다. Kotlin 타입을 참조할 때 해당 API를 사용하여 임포트(import)가 제대로 작동하도록 해야 합니다. 코드 생성(codegen)을 어떤 식으로든 수정한다면, `sqldelight-compiler:integration-tests`의 통합 테스트를 업데이트하므로 풀 리퀘스트를 열기 전에 `./gradlew build`를 실행하세요. 통합 테스트(런타임 환경에서 SQL 쿼리를 실행하는 것을 의미)를 작성하고 싶다면, `sqldelight-compiler:integration-tests`에 테스트를 추가하세요.

---

## SQL PSI

다음 섹션에서는 파서(parser) 및 PSI 계층에 기여하는 방법을 다룰 것입니다. 하지만 그 전에 [sql-psi](https://github.com/AlecStrong/sql-psi)의 다양한 구성 요소를 이해하기 위해 [다중 방언 (multiple dialects)](https://www.alecstrong.com/posts/multiple-dialects/)에 대한 블로그 게시물을 읽어야 합니다. SQLDelight와 마찬가지로, 문제를 겪고 있지만 수정 방법을 모르거나 도움이 필요하다면, GitHub 이슈에 댓글을 달거나 새로운 이슈를 생성하여 논의를 시작하세요.

SQL-PSI에서 변경 사항이 있다면, 해당 `core/src/test/fixtures_*` 폴더에 테스트 픽스처(fixture)를 추가해야 합니다. 접미사가 없는 `fixtures` 폴더는 모든 방언에 대해 실행됩니다. SQL-PSI에 변경 사항이 병합된 후 SQLDelight에서도 변경해야 할 사항이 있다면, SQLDelight의 `sql-psi-dev` 브랜치를 체크아웃(check out)하고 해당 브랜치를 PR 대상으로 지정하세요. 이 브랜치는 sql-psi의 스냅샷 릴리스(snapshot release)를 사용하므로, sql-psi 변경 사항이 병합된 후 약 10분 뒤에 SQLDelight 변경 사항을 빌드할 수 있습니다.

### 문법

문법에 추가하고 있다면, 먼저 이것이 기존 문법에 추가하는 새로운 규칙인지, 아니면 ANSI SQL([sql.bnf](https://github.com/AlecStrong/sql-psi/blob/master/core/src/main/kotlin/com/alecstrong/sql/psi/core/sql.bnf)에 있음)에서 재정의(override)하려는 규칙인지 결정하세요. 두 경우 모두 새로운 문법에 해당 규칙을 정의해야 합니다. 하지만 ANSI SQL 규칙을 재정의하는 경우에는 `overrides` 목록에 추가하고 규칙에 `override` 속성을 설정하세요:

```bnf
overrides ::= my_rule

my_rule ::= SOME_TOKEN {
  override = true
}
```

규칙의 정의는 ANSI-SQL의 규칙을 정확히 복사/붙여넣기하는 것으로 시작해야 합니다. ANSI-SQL의 규칙을 참조하려면 중괄호 `{}`로 감싸야 합니다. 따라서 재정의하는 규칙의 모든 외부 규칙을 `{}`로 감싸야 합니다:

```bnf
my_rule ::= internal_rule {external_rule} {
  override = true
}
internal_rule ::= SOME_TOKEN
```

한 가지 주의할 점은 ANSI-SQL의 `expr` 규칙을 참조할 때는 `<<expr '-1'>>`와 같아야 한다는 것입니다. 이는 특별하며 재정의할 수 없기 때문입니다.

ANSI SQL에서 사용하려는 토큰은 또한 수동으로 임포트(import)되어야 합니다:

```bnf
{
  parserImports = [
    "static com.alecstrong.sql.psi.core.psi.SqlTypes.DELETE"
    "static com.alecstrong.sql.psi.core.psi.SqlTypes.FROM"
  ]
}
overrides ::= delete

delete ::= DELETE FROM {table_name} {
  override = true
}
```

방언(dialects)은 자체 토큰을 추가할 수 없지만, 큰따옴표 `""`로 감싸서 정확한 텍스트를 요구할 수 있습니다:

```bnf
my_rule ::= "SOME_TOKEN"
```

재정의하는 규칙은 여전히 원본 규칙 유형에 부합하는 코드를 생성해야 하므로, 원본 규칙의 기존 유형을 `implement`하고 `extend`해야 합니다:

```bnf
my_rule ::= internal_rule {external_rule} {
  extends = "com.alecstrong.sql.psi.core.psi.impl.SqlMyRuleImpl"
  implements = "com.alecstrong.sql.psi.core.psi.SqlMyRule"
  overrides = true
}
```

문법에서 규칙을 재정의하는 예시를 보려면 PostgreSQL에 `RETURNING` 문법을 추가하는 [이 PR](https://github.com/AlecStrong/sql-psi/pull/163/files)을 확인해 보세요.

### 규칙 동작

종종 PSI 계층의 동작을 수정하고 싶을 때가 있습니다(예를 들어 컴파일을 실패시키고 싶은 상황에 오류를 발생시키는 것). 이를 위해 규칙이 `extends` 대신 `mixin`을 사용하도록 하세요. `mixin`은 새로운 로직을 포함하는 직접 작성하는 클래스입니다:

```bnf
my_rule ::= interal_rule {external_rule} {
  mixin = "com.alecstrong.sql.psi.MyRuleMixin"
  implements = "com.alecstrong.sql.psi.core.psi.SqlMyRule"
  overrides = true
}
```

그리고 해당 클래스에서 원본 ANSI SQL 타입과 SQL-PSI 기본 클래스인 `SqlCompositeElementImpl`를 구현하는지 확인하세요:

```
class MyRule(
  node: ASTNode
) : SqlCompositeElementImpl(node),
    SqlMyRule {
  fun annotate(annotationHolder: SqlAnnotationHolder) {
    if (internal_rule.text == "bad_text") {
      annotationHolder.createErrorAnnotation("Invalid text value", internal_rule)
    }
  }
}
```

예를 들어, [DropIndexMixin](https://github.com/AlecStrong/sql-psi/blob/f1137ff82dd0aa77f741a09d88855fbf9b751c00/core/src/main/kotlin/com/alecstrong/sql/psi/core/psi/mixins/DropIndexMixin.kt)은 삭제될 인덱스가 스키마에 존재하는지 확인합니다.

---

이 문서에 다루지 않은 기여에 대한 질문이 있다면, SqlDelight에 이슈를 열거나 PR을 열어 저희가 개선 작업을 할 수 있도록 자유롭게 문의해 주세요!