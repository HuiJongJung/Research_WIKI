# MCP 클라이언트 연결 가이드

이 문서는 로컬 Research WIKI MCP를 Codex와 Claude Code에 연결하는 방법을 설명합니다.

## 준비

프로젝트 루트에서 패키지를 설치합니다.

```powershell
python -m pip install -e .
```

일반적인 로컬 사용은 `stdio` 연결을 권장합니다. 한 컴퓨터에서 별도 프로세스로 서버를 띄워 확인할 때는 토큰 보호 HTTP 연결을 사용할 수 있습니다.

## Codex

### stdio

```powershell
codex mcp add research-wiki -- research-wiki-mcp --root "C:\path\to\Media_AI_MCP"
codex mcp list
codex mcp get research-wiki
```

Codex CLI와 IDE 확장은 같은 MCP 설정을 사용합니다.

### Streamable HTTP

먼저 서버를 실행합니다.

```powershell
$env:RESEARCH_WIKI_MCP_TOKEN = "replace-with-a-local-shared-token"
research-wiki-mcp --transport streamable-http --host 127.0.0.1 --port 8765 --root .
```

다른 PowerShell 창에서 같은 환경 변수를 설정한 뒤 등록합니다.

```powershell
$env:RESEARCH_WIKI_MCP_TOKEN = "replace-with-a-local-shared-token"
codex mcp add research-wiki-http --url http://127.0.0.1:8765/mcp --bearer-token-env-var RESEARCH_WIKI_MCP_TOKEN
codex mcp list
```

Codex의 MCP CLI 형식은 OpenAI 공식 [Docs MCP 가이드](https://platform.openai.com/docs/docs-mcp)와 설치된 `codex mcp add --help`를 기준으로 작성했습니다.

## Claude Code

### 프로젝트 공유 stdio 설정

저장소의 [.mcp.json](../.mcp.json)은 다음 서버를 공유합니다.

```json
{
  "mcpServers": {
    "research-wiki": {
      "type": "stdio",
      "command": "research-wiki-mcp",
      "args": ["--root", "${CLAUDE_PROJECT_DIR:-.}"]
    }
  }
}
```

Claude Code는 프로젝트 범위 `.mcp.json` 서버를 처음 사용할 때 승인을 요청합니다. 설정을 직접 다시 만들려면:

```powershell
claude mcp add --transport stdio --scope project research-wiki -- research-wiki-mcp --root '${CLAUDE_PROJECT_DIR:-.}'
claude mcp list
claude mcp get research-wiki
```

### Streamable HTTP

토큰을 Git에 기록하지 않도록 환경 변수 표현을 로컬 범위 설정에 저장합니다.

```powershell
$env:RESEARCH_WIKI_MCP_TOKEN = "replace-with-a-local-shared-token"
claude mcp add-json --scope local research-wiki-http '{"type":"http","url":"http://127.0.0.1:8765/mcp","headers":{"Authorization":"Bearer ${RESEARCH_WIKI_MCP_TOKEN}"}}'
claude mcp list
```

Claude Code의 프로젝트 범위, `.mcp.json`, 환경 변수 확장, HTTP 헤더 형식은 공식 [Claude Code MCP 가이드](https://code.claude.com/docs/en/mcp)를 기준으로 작성했습니다.

## 첫 요청 예시

연결 후 다음과 같이 요청할 수 있습니다.

```text
raw/papers/example.pdf를 전체 페이지 텍스트 방식으로 읽고 한국어로 정리하세요.
근거 중심 source 페이지와 재사용 가능한 concept 페이지를 draft로 저장하세요.
```

영어 정리가 필요하면 명시합니다.

```text
raw/papers/example.pdf의 1-4쪽을 이미지 + 텍스트 방식으로 읽고 영어로 정리하세요.
```

claim은 사용자의 연구 아이디어가 추가로 필요합니다.

```text
claim/my-idea를 만들고 기존 WIKI 근거를 사용해 적합성과 novelty 위험을 검토하세요.
```
