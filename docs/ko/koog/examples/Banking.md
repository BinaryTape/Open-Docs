# 코그(Koog)로 AI 뱅킹 어시스턴트 구축하기

[:material-github: GitHub에서 열기](
https://github.com/JetBrains/koog/blob/develop/examples/notebooks/Banking.ipynb
){ .md-button .md-button--primary }
[:material-download: .ipynb 다운로드](
https://raw.githubusercontent.com/JetBrains/koog/develop/examples/notebooks/Banking.ipynb
){ .md-button }

이 튜토리얼에서는 Kotlin의 **코그(Koog)** 에이전트를 사용하여 작은 뱅킹 어시스턴트를 구축합니다.
다음 방법을 배우게 됩니다.
- 도메인 모델과 샘플 데이터 정의하기
- **송금** 및 **거래 분석**을 위한 기능 중심 도구 노출하기
- 사용자 의도 분류하기 (송금 vs 분석)
- 두 가지 스타일로 호출을 오케스트레이션하기:
  1) 그래프/서브그래프 전략
  2) "도구로서의 에이전트"

튜토리얼을 마치면 자유 형식의 사용자 요청을 올바른 도구로 라우팅하고 유용하며 감사 가능한 응답을 생성할 수 있습니다.

## 설정 및 의존성

Kotlin Notebook 커널을 사용할 것입니다. Koog 아티팩트가 Maven Central에서 해결 가능하며, `OPENAI_API_KEY`를 통해 LLM 공급자 키를 사용할 수 있는지 확인하세요.

```kotlin
%useLatestDescriptors
%use datetime

// uncomment this for using koog from Maven Central
// %use koog
```

```kotlin
import ai.koog.prompt.executor.llms.all.simpleOpenAIExecutor

val apiKey = System.getenv("OPENAI_API_KEY") ?: error("Please set OPENAI_API_KEY environment variable")
val openAIExecutor = simpleOpenAIExecutor(apiKey)
```

## 시스템 프롬프트 정의

잘 작성된 시스템 프롬프트는 AI가 자신의 역할과 제약을 이해하는 데 도움이 됩니다. 이 프롬프트는 모든 에이전트의 행동을 안내합니다.

```kotlin
val bankingAssistantSystemPrompt = """
    |You are a banking assistant interacting with a user (userId=123).
    |Your goal is to understand the user's request and determine whether it can be fulfilled using the available tools.
    |
    |If the task can be accomplished with the provided tools, proceed accordingly,
    |at the end of the conversation respond with: "Task completed successfully."
    |If the task cannot be performed with the tools available, respond with: "Can't perform the task."
""".trimMargin()
```

## 도메인 모델 및 샘플 데이터

먼저 도메인 모델과 샘플 데이터를 정의하겠습니다. Kotlin의 데이터 클래스와 직렬화 지원을 사용할 것입니다.

```kotlin
import kotlinx.serialization.Serializable

@Serializable
data class Contact(
    val id: Int,
    val name: String,
    val surname: String? = null,
    val phoneNumber: String
)

val contactList = listOf(
    Contact(100, "Alice", "Smith", "+1 415 555 1234"),
    Contact(101, "Bob", "Johnson", "+49 151 23456789"),
    Contact(102, "Charlie", "Williams", "+36 20 123 4567"),
    Contact(103, "Daniel", "Anderson", "+46 70 123 45 67"),
    Contact(104, "Daniel", "Garcia", "+34 612 345 678"),
)

val contactById = contactList.associateBy(Contact::id)
```

## 도구: 송금

도구는 **순수**하고 예측 가능해야 합니다.

두 가지 "느슨한 계약"을 모델링합니다.
- `chooseRecipient`는 모호성이 감지될 때 *후보*를 반환합니다.
- `sendMoney`는 `confirmed` 플래그를 지원합니다. `false`인 경우 에이전트에게 사용자에게 확인을 요청합니다.

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import ai.koog.agents.core.tools.annotations.Tool
import ai.koog.agents.core.tools.reflect.ToolSet

@LLMDescription("송금 작업을 위한 도구입니다.")
class MoneyTransferTools : ToolSet {

    @Tool
    @LLMDescription(
        """
        주어진 사용자의 연락처 목록을 반환합니다.
        이 데모에서 사용자는 항상 userId=123입니다.
        """
    )
    fun getContacts(
        @LLMDescription("연락처 목록이 요청된 사용자의 고유 식별자입니다.") userId: Int
    ): String = buildString {
        contactList.forEach { c ->
            appendLine("${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})")
        }
    }.trimEnd()

    @Tool
    @LLMDescription("현재 잔액(데모 값)을 반환합니다.")
    fun getBalance(
        @LLMDescription("사용자의 고유 식별자입니다.") userId: Int
    ): String = "Balance: 200.00 EUR"

    @Tool
    @LLMDescription("기본 사용자 통화(데모 값)를 반환합니다.")
    fun getDefaultCurrency(
        @LLMDescription("사용자의 고유 식별자입니다.") userId: Int
    ): String = "EUR"

    @Tool
    @LLMDescription("두 ISO 통화(예: EUR→USD) 간의 데모 환율을 반환합니다.")
    fun getExchangeRate(
        @LLMDescription("기준 통화(예: EUR).") from: String,
        @LLMDescription("대상 통화(예: USD).") to: String
    ): String = when (from.uppercase() to to.uppercase()) {
        "EUR" to "USD" -> "1.10"
        "EUR" to "GBP" -> "0.86"
        "GBP" to "EUR" -> "1.16"
        "USD" to "EUR" -> "0.90"
        else -> "No information about exchange rate available."
    }

    @Tool
    @LLMDescription(
        """
        모호한 이름에 대해 가능한 수신자 순위 목록을 반환합니다.
        에이전트는 사용자에게 하나를 선택하도록 요청한 다음 선택한 연락처 ID를 사용해야 합니다.
        """
    )
    fun chooseRecipient(
        @LLMDescription("모호하거나 부분적인 연락처 이름입니다.") confusingRecipientName: String
    ): String {
        val matches = contactList.filter { c ->
            c.name.contains(confusingRecipientName, ignoreCase = true) ||
                (c.surname?.contains(confusingRecipientName, ignoreCase = true) ?: false)
        }
        if (matches.isEmpty()) {
            return "No candidates found for '$confusingRecipientName'. Use getContacts and ask the user to choose."
        }
        return matches.mapIndexed { idx, c ->
            "${idx + 1}. ${c.id}: ${c.name} ${c.surname ?: ""} (${c.phoneNumber})"
        }.joinToString("
")
    }

    @Tool
    @LLMDescription(
        """
        사용자로부터 연락처로 돈을 보냅니다.
        confirmed=false이면 사람에게 읽기 쉬운 요약과 함께 "REQUIRES_CONFIRMATION"을 반환합니다.
        에이전트는 confirmed=true로 다시 시도하기 전에 사용자에게 확인해야 합니다.
        """
    )
    fun sendMoney(
        @LLMDescription("송신자 사용자 ID.") senderId: Int,
        @LLMDescription("송신자의 기본 통화로 된 금액.") amount: Double,
        @LLMDescription("수신자 연락처 ID.") recipientId: Int,
        @LLMDescription("간단한 목적/설명.") purpose: String,
        @LLMDescription("사용자가 이미 이 송금을 확인했는지 여부.") confirmed: Boolean = false
    ): String {
        val recipient = contactById[recipientId] ?: return "Invalid recipient."
        val summary = "Transfer €%.2f to %s %s (%s) for \"%s\"."
            .format(amount, recipient.name, recipient.surname ?: "", recipient.phoneNumber, purpose)

        if (!confirmed) {
            return "REQUIRES_CONFIRMATION: $summary"
        }

        // In a real system this is where you'd call a payment API.
        return "Money was sent. $summary"
    }
}
```

## 첫 번째 에이전트 생성
이제 송금 도구를 사용하는 에이전트를 만들겠습니다.
에이전트는 LLM과 도구를 결합하여 작업을 수행합니다.

```kotlin
import ai.koog.agents.core.agent.AIAgent
import ai.koog.agents.core.agent.AIAgentService
import ai.koog.agents.core.tools.ToolRegistry
import ai.koog.agents.core.tools.reflect.asTools
import ai.koog.agents.ext.tool.AskUser
import ai.koog.prompt.executor.clients.openai.OpenAIModels
import kotlinx.coroutines.runBlocking

val transferAgentService = AIAgentService(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = bankingAssistantSystemPrompt,
    temperature = 0.0,  // 금융 거래에 대해 결정론적 응답 사용
    toolRegistry = ToolRegistry {
        tool(AskUser)
        tools(MoneyTransferTools().asTools())
    }
)

// 다양한 시나리오로 에이전트 테스트
println("뱅킹 어시스턴트가 시작되었습니다")
val message = "Send 25 euros to Daniel for dinner at the restaurant."

// 시도해 볼 수 있는 다른 테스트 메시지:
// - "콘서트 티켓 값으로 Alice에게 50유로를 보내줘"
// - "현재 잔액이 얼마야?"
// - "Bob에게 공유 휴가 비용으로 100유로를 송금해줘"

runBlocking {
    val result = transferAgentService.createAgentAndRun(message)
    result
}
```

    뱅킹 어시스턴트가 시작되었습니다
    'Daniel'이라는 이름의 연락처가 두 개 있습니다. 누구에게 송금하시겠습니까?
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    “저녁 식사” 명목으로 Daniel Garcia(+34 612 345 678)에게 €25.00를 송금하는 것을 확인하시겠습니까?

    작업이 성공적으로 완료되었습니다.

## 거래 분석 추가
이제 거래 분석 도구를 사용하여 어시스턴트의 기능을 확장해 보겠습니다.
먼저, 거래 도메인 모델을 정의합니다.

```kotlin
@Serializable
enum class TransactionCategory(val title: String) {
    FOOD_AND_DINING("Food & Dining"),
    SHOPPING("Shopping"),
    TRANSPORTATION("Transportation"),
    ENTERTAINMENT("Entertainment"),
    GROCERIES("Groceries"),
    HEALTH("Health"),
    UTILITIES("Utilities"),
    HOME_IMPROVEMENT("Home Improvement");

    companion object {
        fun fromString(value: String): TransactionCategory? =
            entries.find { it.title.equals(value, ignoreCase = true) }

        fun availableCategories(): String =
            entries.joinToString(", ") { it.title }
    }
}

@Serializable
data class Transaction(
    val merchant: String,
    val amount: Double,
    val category: TransactionCategory,
    val date: LocalDateTime
)
```

### 샘플 거래 데이터

```kotlin
val transactionAnalysisPrompt = """
Today is 2025-05-22.
Available categories for transactions: ${TransactionCategory.availableCategories()}
"""

val sampleTransactions = listOf(
    Transaction("Starbucks", 5.99, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 22, 8, 30, 0, 0)),
    Transaction("Amazon", 129.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 22, 10, 15, 0, 0)),
    Transaction(
        "Shell Gas Station",
        45.50,
        TransactionCategory.TRANSPORTATION,
        LocalDateTime(2025, 5, 21, 18, 45, 0, 0)
    ),
    Transaction("Netflix", 15.99, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 21, 12, 0, 0, 0)),
    Transaction("AMC Theaters", 32.50, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 20, 19, 30, 0, 0)),
    Transaction("Whole Foods", 89.75, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 20, 16, 20, 0, 0)),
    Transaction("Target", 67.32, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 20, 14, 30, 0, 0)),
    Transaction("CVS Pharmacy", 23.45, TransactionCategory.HEALTH, LocalDateTime(2025, 5, 19, 11, 25, 0, 0)),
    Transaction("Subway", 12.49, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 19, 13, 15, 0, 0)),
    Transaction("Spotify Premium", 9.99, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 19, 14, 15, 0, 0)),
    Transaction("AT&T", 85.00, TransactionCategory.UTILITIES, LocalDateTime(2025, 5, 18, 9, 0, 0, 0)),
    Transaction("Home Depot", 156.78, TransactionCategory.HOME_IMPROVEMENT, LocalDateTime(2025, 5, 18, 15, 45, 0, 0)),
    Transaction("Amazon", 129.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 17, 10, 15, 0, 0)),
    Transaction("Starbucks", 5.99, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 17, 8, 30, 0, 0)),
    Transaction("Whole Foods", 89.75, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 16, 16, 20, 0, 0)),
    Transaction("CVS Pharmacy", 23.45, TransactionCategory.HEALTH, LocalDateTime(2025, 5, 15, 11, 25, 0, 0)),
    Transaction("AT&T", 85.00, TransactionCategory.UTILITIES, LocalDateTime(2025, 5, 14, 9, 0, 0, 0)),
    Transaction("Xbox Game Pass", 14.99, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 14, 16, 45, 0, 0)),
    Transaction("Aldi", 76.45, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 13, 17, 30, 0, 0)),
    Transaction("Chipotle", 15.75, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 13, 12, 45, 0, 0)),
    Transaction("Best Buy", 299.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 12, 14, 20, 0, 0)),
    Transaction("Olive Garden", 89.50, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 12, 19, 15, 0, 0)),
    Transaction("Whole Foods", 112.34, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 11, 10, 30, 0, 0)),
    Transaction("Old Navy", 45.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 11, 13, 45, 0, 0)),
    Transaction("Panera Bread", 18.25, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 10, 11, 30, 0, 0)),
    Transaction("Costco", 245.67, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 10, 15, 20, 0, 0)),
    Transaction("Five Guys", 22.50, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 9, 18, 30, 0, 0)),
    Transaction("Macy's", 156.78, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 9, 14, 15, 0, 0)),
    Transaction("Hulu Plus", 12.99, TransactionCategory.ENTERTAINMENT, LocalDateTime(2025, 5, 8, 20, 0, 0, 0)),
    Transaction("Whole Foods", 94.23, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 8, 16, 45, 0, 0)),
    Transaction("Texas Roadhouse", 78.90, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 8, 19, 30, 0, 0)),
    Transaction("Walmart", 167.89, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 7, 11, 20, 0, 0)),
    Transaction("Chick-fil-A", 14.75, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 7, 12, 30, 0, 0)),
    Transaction("Aldi", 82.45, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 6, 15, 45, 0, 0)),
    Transaction("TJ Maxx", 67.90, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 6, 13, 20, 0, 0)),
    Transaction("P.F. Chang's", 95.40, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 5, 19, 15, 0, 0)),
    Transaction("Whole Foods", 78.34, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 4, 14, 30, 0, 0)),
    Transaction("H&M", 89.99, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 3, 16, 20, 0, 0)),
    Transaction("Red Lobster", 112.45, TransactionCategory.FOOD_AND_DINING, LocalDateTime(2025, 5, 2, 18, 45, 0, 0)),
    Transaction("Whole Foods", 67.23, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 2, 11, 30, 0, 0)),
    Transaction("Marshalls", 123.45, TransactionCategory.SHOPPING, LocalDateTime(2025, 5, 1, 15, 20, 0, 0)),
    Transaction(
        "Buffalo Wild Wings",
        45.67,
        TransactionCategory.FOOD_AND_DINING,
        LocalDateTime(2025, 5, 1, 19, 30, 0, 0)
    ),
    Transaction("Aldi", 145.78, TransactionCategory.GROCERIES, LocalDateTime(2025, 5, 1, 10, 15, 0, 0))
)
```

## 거래 분석 도구

```kotlin
@LLMDescription("거래 내역 분석을 위한 도구")
class TransactionAnalysisTools : ToolSet {

    @Tool
    @LLMDescription(
        """
        userId, 카테고리, 시작일, 종료일로 필터링된 거래를 검색합니다.
        모든 매개변수는 선택 사항입니다. 매개변수가 제공되지 않으면 모든 거래가 반환됩니다.
        날짜는 YYYY-MM-DD 형식이어야 합니다.
        """
    )
    fun getTransactions(
        @LLMDescription("거래를 검색할 사용자의 ID.")
        userId: String? = null,
        @LLMDescription("거래를 필터링할 카테고리(예: 'Food & Dining').")
        category: String? = null,
        @LLMDescription("YYYY-MM-DD 형식의 시작일로 거래를 필터링합니다.")
        startDate: String? = null,
        @LLMDescription("YYYY-MM-DD 형식의 종료일로 거래를 필터링합니다.")
        endDate: String? = null
    ): String {
        var filteredTransactions = sampleTransactions

        // userId 유효성 검사 (실제 환경에서는 실제 데이터베이스에 쿼리)
        if (userId != null && userId != "123") {
            return "No transactions found for user $userId."
        }

        // 카테고리 필터 적용
        category?.let { cat ->
            val categoryEnum = TransactionCategory.fromString(cat)
                ?: return "Invalid category: $cat. Available: ${TransactionCategory.availableCategories()}"
            filteredTransactions = filteredTransactions.filter { it.category == categoryEnum }
        }

        // 날짜 범위 필터 적용
        startDate?.let { date ->
            val startDateTime = parseDate(date, startOfDay = true)
            filteredTransactions = filteredTransactions.filter { it.date >= startDateTime }
        }

        endDate?.let { date ->
            val endDateTime = parseDate(date, startOfDay = false)
            filteredTransactions = filteredTransactions.filter { it.date <= endDateTime }
        }

        if (filteredTransactions.isEmpty()) {
            return "No transactions found matching the specified criteria."
        }

        return filteredTransactions.joinToString("
") { transaction ->
            "${transaction.date}: ${transaction.merchant} - " +
                "${transaction.amount} (${transaction.category.title})"
        }
    }

    @Tool
    @LLMDescription("더블형 숫자 배열의 합계를 계산합니다.")
    fun sumArray(
        @LLMDescription("합산할 더블형 숫자의 쉼표로 구분된 목록(예: '1.5,2.3,4.7').")
        numbers: String
    ): String {
        val numbersList = numbers.split(",")
            .mapNotNull { it.trim().toDoubleOrNull() }
        val sum = numbersList.sum()
        return "Sum: $%.2f".format(sum)
    }

    // 날짜 파싱 도우미 함수
    private fun parseDate(dateStr: String, startOfDay: Boolean): LocalDateTime {
        val parts = dateStr.split("-").map { it.toInt() }
        require(parts.size == 3) { "Invalid date format. Use YYYY-MM-DD" }

        return if (startOfDay) {
            LocalDateTime(parts[0], parts[1], parts[2], 0, 0, 0, 0)
        } else {
            LocalDateTime(parts[0], parts[1], parts[2], 23, 59, 59, 999999999)
        }
    }
}
```

```kotlin
val analysisAgentService = AIAgentService(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    systemPrompt = "$bankingAssistantSystemPrompt
$transactionAnalysisPrompt",
    temperature = 0.0,
    toolRegistry = ToolRegistry {
        tools(TransactionAnalysisTools().asTools())
    }
)

println("거래 분석 어시스턴트가 시작되었습니다")
val analysisMessage = "How much have I spent on restaurants this month?"

// 시도해 볼 수 있는 다른 쿼리:
// - "이번 달 레스토랑에서 가장 많이 지출한 금액은 얼마야?"
// - "5월 첫째 주에 식료품에 얼마를 지출했어?"
// - "5월에 엔터테인먼트에 총 얼마를 지출했어?"
// - "지난주 모든 거래를 보여줘"

runBlocking {
    val result = analysisAgentService.createAgentAndRun(analysisMessage)
    result
}
```

    거래 분석 어시스턴트가 시작되었습니다

    이번 달에 레스토랑에 총 $517.64를 지출했습니다. 
    
    작업이 성공적으로 완료되었습니다.

## 그래프로 에이전트 구축
이제 특수 에이전트들을 그래프 에이전트로 결합하여 요청을 적절한 핸들러로 라우팅할 수 있도록 하겠습니다.

### 요청 분류
먼저, 들어오는 요청을 분류할 방법이 필요합니다.

```kotlin
import ai.koog.agents.core.tools.annotations.LLMDescription
import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Suppress("unused")
@SerialName("UserRequestType")
@Serializable
@LLMDescription("사용자 요청 유형: 송금 또는 분석")
enum class RequestType { Transfer, Analytics }

@Serializable
@LLMDescription("에이전트가 분류한 은행 요청입니다.")
data class ClassifiedBankRequest(
    @property:LLMDescription("요청 유형: 송금 또는 분석")
    val requestType: RequestType,
    @property:LLMDescription("뱅킹 애플리케이션에서 수행될 실제 요청")
    val userRequest: String
)

```

### 공유 도구 레지스트리

```kotlin
// 다중 에이전트 시스템을 위한 포괄적인 도구 레지스트리 생성
val toolRegistry = ToolRegistry {
    tool(AskUser)  // 에이전트가 설명을 요청할 수 있도록 허용
    tools(MoneyTransferTools().asTools())
    tools(TransactionAnalysisTools().asTools())
}
```

## 에이전트 전략

이제 여러 노드를 오케스트레이션하는 전략을 만들겠습니다.

```kotlin
import ai.koog.agents.core.dsl.builder.forwardTo
import ai.koog.agents.core.dsl.builder.strategy
import ai.koog.agents.core.dsl.extension.*
import ai.koog.agents.ext.agent.subgraphWithTask
import ai.koog.prompt.structure.StructureFixingParser

val strategy = strategy<String, String>("banking assistant") {

    // 사용자 요청을 분류하기 위한 서브그래프
    val classifyRequest by subgraph<String, ClassifiedBankRequest>(
        tools = listOf(AskUser)
    ) {
        // 적절한 분류를 위해 구조화된 출력을 사용합니다
        val requestClassification by nodeLLMRequestStructured<ClassifiedBankRequest>(
            examples = listOf(
                ClassifiedBankRequest(
                    requestType = RequestType.Transfer,
                    userRequest = "Send 25 euros to Daniel for dinner at the restaurant."
                ),
                ClassifiedBankRequest(
                    requestType = RequestType.Analytics,
                    userRequest = "Provide transaction overview for the last month"
                )
            ),
            fixingParser = StructureFixingParser(
                fixingModel = OpenAIModels.CostOptimized.GPT4oMini,
                retries = 2,
            )
        )

        val callLLM by nodeLLMRequest()
        val callAskUserTool by nodeExecuteTool()

        // 흐름 정의
        edge(nodeStart forwardTo requestClassification)

        edge(
            requestClassification forwardTo nodeFinish
                onCondition { it.isSuccess }
                transformed { it.getOrThrow().structure }
        )

        edge(
            requestClassification forwardTo callLLM
                onCondition { it.isFailure }
                transformed { "Failed to understand the user's intent" }
        )

        edge(callLLM forwardTo callAskUserTool onToolCall { true })

        edge(
            callLLM forwardTo callLLM onAssistantMessage { true }
                transformed { "Please call `${AskUser.name}` tool instead of chatting" }
        )

        edge(callAskUserTool forwardTo requestClassification
            transformed { it.result.toString() })
    }

    // 송금 처리를 위한 서브그래프
    val transferMoney by subgraphWithTask<ClassifiedBankRequest, String>(
        tools = MoneyTransferTools().asTools() + AskUser,
        llmModel = OpenAIModels.Chat.GPT4o  // 송금을 위해 더 강력한 모델 사용
    ) { request ->
        """
        $bankingAssistantSystemPrompt
        Specifically, you need to help with the following request:
        ${request.userRequest}
        """.trimIndent()
    }

    // 거래 분석을 위한 서브그래프
    val transactionAnalysis by subgraphWithTask<ClassifiedBankRequest, String>(
        tools = TransactionAnalysisTools().asTools() + AskUser,
    ) { request ->
        """
        $bankingAssistantSystemPrompt
        $transactionAnalysisPrompt
        Specifically, you need to help with the following request:
        ${request.userRequest}
        """.trimIndent()
    }

    // 서브그래프 연결
    edge(nodeStart forwardTo classifyRequest)

    edge(classifyRequest forwardTo transferMoney
        onCondition { it.requestType == RequestType.Transfer })

    edge(classifyRequest forwardTo transactionAnalysis
        onCondition { it.requestType == RequestType.Analytics })

    // 결과를 완료 노드로 라우팅
    edge(transferMoney forwardTo nodeFinish)
    edge(transactionAnalysis forwardTo nodeFinish)
}
```

```kotlin
import ai.koog.agents.core.agent.config.AIAgentConfig
import ai.koog.prompt.dsl.prompt

val agentConfig = AIAgentConfig(
    prompt = prompt(id = "banking assistant") {
        system("$bankingAssistantSystemPrompt
$transactionAnalysisPrompt")
    },
    model = OpenAIModels.Chat.GPT4o,
    maxAgentIterations = 50  // 복잡한 다단계 작업을 허용합니다
)

val agent = AIAgent<String, String>(
    promptExecutor = openAIExecutor,
    strategy = strategy,
    agentConfig = agentConfig,
    toolRegistry = toolRegistry,
)
```

## 그래프 에이전트 실행

```kotlin
println("뱅킹 어시스턴트가 시작되었습니다")
val testMessage = "Send 25 euros to Daniel for dinner at the restaurant."

// 다양한 시나리오 테스트:
// 송금 요청:
//   - "콘서트 티켓 값으로 Alice에게 50유로를 보내줘"
//   - "Bob에게 식료품 값으로 100유로를 송금해줘"
//   - "현재 잔액이 얼마야?"
//
// 분석 요청:
//   - "이번 달 레스토랑에 얼마를 지출했어?"
//   - "이번 달 레스토랑에서 가장 많이 지출한 금액은 얼마야?"
//   - "5월 첫째 주에 식료품에 얼마를 지출했어?"
//   - "5월에 엔터테인먼트에 총 얼마를 지출했어?"

runBlocking {
    val result = agent.run(testMessage)
    "Result: $result"
}
```

    뱅킹 어시스턴트가 시작되었습니다
    'Daniel'이라는 이름의 연락처가 여러 개 있습니다. 올바른 연락처를 선택해 주세요:
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    정확한 수신자의 번호를 지정해 주세요.
    Daniel Garcia에게 "저녁 식사" 명목으로 €25를 송금하는 것을 진행하시겠습니까?

    Result: 작업이 성공적으로 완료되었습니다.

## 에이전트 구성 — 도구로서 에이전트 사용

코그(Koog)는 에이전트를 다른 에이전트 내에서 도구로 사용할 수 있게 하여 강력한 구성 패턴을 가능하게 합니다.

```kotlin
import ai.koog.agents.core.agent.createAgentTool
import ai.koog.agents.core.tools.ToolParameterDescriptor
import ai.koog.agents.core.tools.ToolParameterType

val classifierAgent = AIAgent(
    executor = openAIExecutor,
    llmModel = OpenAIModels.Reasoning.GPT4oMini,
    toolRegistry = ToolRegistry {
        tool(AskUser)

        // 에이전트를 도구로 변환
        tool(
            transferAgentService.createAgentTool(
                agentName = "transferMoney",
                agentDescription = "송금 및 모든 관련 작업을 처리합니다",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "사용자로부터의 송금 요청",
                    type = ToolParameterType.String
                )
            )
        )

        tool(
            analysisAgentService.createAgentTool(
                agentName = "analyzeTransactions",
                agentDescription = "사용자 거래에 대한 분석을 수행합니다",
                inputDescriptor = ToolParameterDescriptor(
                    name = "request",
                    description = "거래 분석 요청",
                    type = ToolParameterType.String
                )
            )
        )
    },
    systemPrompt = "$bankingAssistantSystemPrompt
$transactionAnalysisPrompt"
)
```

## 구성된 에이전트 실행

```kotlin
println("뱅킹 어시스턴트가 시작되었습니다")
val composedMessage = "Send 25 euros to Daniel for dinner at the restaurant."

runBlocking {
    val result = classifierAgent.run(composedMessage)
    "Result: $result"
}
```

    뱅킹 어시스턴트가 시작되었습니다
    'Daniel'이라는 이름의 연락처가 두 개 있습니다. 누구에게 송금하시겠습니까?
    1. Daniel Anderson (+46 70 123 45 67)
    2. Daniel Garcia (+34 612 345 678)
    “저녁 식사” 명목으로 Daniel Anderson(+46 70 123 45 67)에게 €25.00를 송금하는 것을 확인하시겠습니까?

    Result: 작업을 수행할 수 없습니다.

## 요약
이 튜토리얼에서는 다음 방법을 배웠습니다.

1.  AI가 도구를 언제 어떻게 사용해야 하는지 이해하는 데 도움이 되는 명확한 설명과 함께 LLM 기반 도구를 생성하는 방법
2.  LLM과 도구를 결합하여 특정 작업을 수행하는 단일 목적 에이전트를 구축하는 방법
3.  복잡한 워크플로를 위한 전략 및 서브그래프를 사용하는 그래프 에이전트를 구현하는 방법
4.  에이전트를 다른 에이전트 내에서 도구로 사용하여 에이전트를 구성하는 방법
5.  확인 및 모호성 해소를 포함한 사용자 상호 작용을 처리하는 방법

## 모범 사례

1.  명확한 도구 설명: AI가 도구 사용법을 이해하는 데 도움이 되도록 상세한 LLMDescription 주석을 작성하세요
2.  관용적인 Kotlin: 데이터 클래스, 확장 함수, 스코프 함수와 같은 Kotlin 기능을 활용하세요
3.  오류 처리: 항상 입력을 유효성 검사하고 의미 있는 오류 메시지를 제공하세요
4.  사용자 경험: 송금과 같은 중요한 작업에는 확인 단계를 포함하세요
5.  모듈성: 더 나은 유지 보수성을 위해 관심사를 다른 도구와 에이전트로 분리하세요